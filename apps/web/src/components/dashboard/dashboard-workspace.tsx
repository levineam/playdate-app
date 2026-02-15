'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DashboardInvite, DashboardPlaydate, DashboardSeed } from '@/lib/dashboard-seed'

interface DashboardWorkspaceProps {
  seed: DashboardSeed
  previewMode: boolean
}

interface AvailabilityDetailsDraft {
  timeWindow: string
  locationHint: string
  note: string
}

interface AvailabilityBroadcast {
  id: string
  sentAt: number
  audienceCount: number
  detailsSummary?: string
}

const BROADCAST_COOLDOWN_SECONDS = 30 * 60
const MAX_BROADCAST_HISTORY = 5

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function formatTime(time: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(`1970-01-01T${time}:00`))
}

function formatClock(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function sortPlaydates(playdates: DashboardPlaydate[]) {
  return [...playdates].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.startTime}:00`).getTime()
    const bDate = new Date(`${b.date}T${b.startTime}:00`).getTime()
    return aDate - bDate
  })
}

function defaultInviteStatuses(invites: DashboardInvite[]) {
  return Object.fromEntries(invites.map((invite) => [invite.id, invite.status])) as Record<
    string,
    DashboardInvite['status']
  >
}

function createLocalId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}`
}

function getAvailabilityDetailsSummary(details: AvailabilityDetailsDraft) {
  const detailParts: string[] = []

  if (details.timeWindow.trim()) {
    detailParts.push(`Window: ${details.timeWindow.trim()}`)
  }

  if (details.locationHint.trim()) {
    detailParts.push(`Location: ${details.locationHint.trim()}`)
  }

  if (details.note.trim()) {
    detailParts.push(`Note: ${details.note.trim()}`)
  }

  return detailParts.join(' · ')
}

export function DashboardWorkspace({ seed, previewMode }: DashboardWorkspaceProps) {
  const [playdates, setPlaydates] = useState<DashboardPlaydate[]>(seed.upcomingPlaydates)
  const [inviteStatuses, setInviteStatuses] = useState<Record<string, DashboardInvite['status']>>(
    defaultInviteStatuses(seed.inviteQueue)
  )
  const [planner, setPlanner] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
  })
  const [plannerMessage, setPlannerMessage] = useState('')

  const [availabilityDetails, setAvailabilityDetails] = useState<AvailabilityDetailsDraft>({
    timeWindow: '',
    locationHint: '',
    note: '',
  })
  const [showDetailsPrompt, setShowDetailsPrompt] = useState(false)
  const [availabilityMessage, setAvailabilityMessage] = useState('')
  const [availabilityBroadcasts, setAvailabilityBroadcasts] = useState<AvailabilityBroadcast[]>([])
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())

  const openInvites = useMemo(
    () => Object.values(inviteStatuses).filter((status) => status === 'pending').length,
    [inviteStatuses]
  )

  const sortedPlaydates = useMemo(() => sortPlaydates(playdates), [playdates])

  useEffect(() => {
    if (!cooldownEndsAt) {
      return
    }

    const timer = window.setInterval(() => {
      const nextNow = Date.now()
      setNowMs(nextNow)

      if (nextNow >= cooldownEndsAt) {
        window.clearInterval(timer)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownEndsAt])

  const cooldownRemainingSeconds = useMemo(() => {
    if (!cooldownEndsAt) {
      return 0
    }

    const remainingMs = cooldownEndsAt - nowMs
    return Math.max(0, Math.ceil(remainingMs / 1000))
  }, [cooldownEndsAt, nowMs])

  const handlePlannerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!planner.title || !planner.date || !planner.startTime || !planner.endTime || !planner.location) {
      setPlannerMessage('Fill in every field to save your draft playdate.')
      return
    }

    if (planner.startTime >= planner.endTime) {
      setPlannerMessage('End time must be later than the start time.')
      return
    }

    const nextPlaydate: DashboardPlaydate = {
      id: createLocalId('draft'),
      title: planner.title,
      date: planner.date,
      startTime: planner.startTime,
      endTime: planner.endTime,
      location: planner.location,
      hostFamily: seed.familyName,
      status: 'draft',
      attendees: [],
    }

    setPlaydates((current) => sortPlaydates([...current, nextPlaydate]))
    setPlanner({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
    })
    setPlannerMessage('Draft saved to your schedule. Invite families when ready.')
  }

  const sendAvailabilityBroadcast = (detailsSummary?: string) => {
    const sentAt = Date.now()

    const nextBroadcast: AvailabilityBroadcast = {
      id: createLocalId('broadcast'),
      sentAt,
      audienceCount: seed.connectedFamilies,
      detailsSummary,
    }

    setAvailabilityBroadcasts((current) => [nextBroadcast, ...current].slice(0, MAX_BROADCAST_HISTORY))
    setCooldownEndsAt(sentAt + BROADCAST_COOLDOWN_SECONDS * 1000)
    setNowMs(sentAt)
    setShowDetailsPrompt(false)
    setAvailabilityDetails({
      timeWindow: '',
      locationHint: '',
      note: '',
    })

    if (detailsSummary) {
      setAvailabilityMessage(`Broadcast sent to ${seed.connectedFamilies} connected families with details.`)
      return
    }

    setAvailabilityMessage(`Broadcast sent to ${seed.connectedFamilies} connected families.`)
  }

  const confirmAndSend = (detailsSummary?: string) => {
    if (cooldownRemainingSeconds > 0) {
      setAvailabilityMessage(`Hold tight — you can broadcast again in ${formatDuration(cooldownRemainingSeconds)}.`)
      return
    }

    const confirmationMessage = detailsSummary
      ? `Send “We're available for a playdate” with details to ${seed.connectedFamilies} connected families?`
      : `Send “We're available for a playdate” to ${seed.connectedFamilies} connected families?`

    const confirmed = window.confirm(confirmationMessage)

    if (!confirmed) {
      setAvailabilityMessage('Broadcast canceled.')
      return
    }

    sendAvailabilityBroadcast(detailsSummary)
  }

  const handleOneTapBroadcast = () => {
    confirmAndSend()
  }

  const handleDetailedBroadcastSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const detailsSummary = getAvailabilityDetailsSummary(availabilityDetails)
    confirmAndSend(detailsSummary || undefined)
  }

  return (
    <div className="flex flex-col gap-6">
      {previewMode && (
        <div
          data-testid="preview-mode-banner"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900"
        >
          <p className="font-medium">Preview mode active</p>
          <p className="mt-1 text-sm">
            Auth is bypassed for this preview deployment. Data shown below is preview seed data plus local draft edits.
          </p>
        </div>
      )}

      <Card
        className="border-emerald-300 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/30"
        data-testid="availability-first-card"
      >
        <CardHeader>
          <CardDescription>Availability-first action</CardDescription>
          <CardTitle className="text-3xl">We&apos;re available for a playdate</CardTitle>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            One tap notifies your connected families so someone can grab the window quickly.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-white/80 p-3 text-sm text-zinc-700 dark:border-emerald-900 dark:bg-black/30 dark:text-zinc-200">
            <p>
              Audience: {seed.connectedFamilies} connected families. Only mutual family connections receive this
              broadcast.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {seed.connectedFamilyNames.map((familyName) => (
                <span
                  key={familyName}
                  className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-900 dark:bg-emerald-900/70 dark:text-emerald-100"
                >
                  {familyName}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="sm:min-w-64"
              data-testid="broadcast-availability-button"
              disabled={cooldownRemainingSeconds > 0}
              onClick={handleOneTapBroadcast}
            >
              {cooldownRemainingSeconds > 0
                ? `Available again in ${formatDuration(cooldownRemainingSeconds)}`
                : 'We\'re available'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDetailsPrompt((current) => !current)}
              data-testid="toggle-availability-details"
              disabled={cooldownRemainingSeconds > 0}
            >
              {showDetailsPrompt ? 'Hide details' : 'Add optional details'}
            </Button>
          </div>

          {showDetailsPrompt && (
            <form
              className="space-y-3 rounded-lg border border-dashed border-emerald-300 bg-white/80 p-4 dark:border-emerald-800 dark:bg-black/20"
              onSubmit={handleDetailedBroadcastSubmit}
              data-testid="availability-details-form"
            >
              <p className="text-sm font-medium">Optional details (shared with your connected families)</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="details-window">Time window</Label>
                  <Input
                    id="details-window"
                    placeholder="Today 4:00–6:00 PM"
                    value={availabilityDetails.timeWindow}
                    onChange={(event) =>
                      setAvailabilityDetails((current) => ({ ...current, timeWindow: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="details-location">Location hint</Label>
                  <Input
                    id="details-location"
                    placeholder="Riverside playground"
                    value={availabilityDetails.locationHint}
                    onChange={(event) =>
                      setAvailabilityDetails((current) => ({ ...current, locationHint: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="details-note">Message</Label>
                <textarea
                  id="details-note"
                  className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Noah is excited for bikes or a park meet-up."
                  value={availabilityDetails.note}
                  onChange={(event) =>
                    setAvailabilityDetails((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </div>
              <Button type="submit">Send detailed availability</Button>
            </form>
          )}

          {availabilityMessage && (
            <p className="text-sm text-zinc-700 dark:text-zinc-300" data-testid="availability-status-message">
              {availabilityMessage}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Connected families</CardDescription>
            <CardTitle className="text-3xl">{seed.connectedFamilies}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Upcoming playdates</CardDescription>
            <CardTitle className="text-3xl">{sortedPlaydates.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Invites awaiting response</CardDescription>
            <CardTitle className="text-3xl">{openInvites}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Last availability broadcast</CardDescription>
            <CardTitle className="text-base sm:text-xl">
              {availabilityBroadcasts[0] ? formatClock(new Date(availabilityBroadcasts[0].sentAt)) : 'Not sent yet'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent availability broadcasts</CardTitle>
            <CardDescription>Helps your family avoid repeat pings and accidental spam.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3" data-testid="availability-history">
            {availabilityBroadcasts.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No broadcasts yet.</p>
            ) : (
              availabilityBroadcasts.map((broadcast) => (
                <div key={broadcast.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Sent to {broadcast.audienceCount} connected families</p>
                  <p className="text-xs text-zinc-500">{formatClock(new Date(broadcast.sentAt))}</p>
                  {broadcast.detailsSummary && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{broadcast.detailsSummary}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite queue</CardTitle>
            <CardDescription>Respond quickly to keep scheduling momentum.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {seed.inviteQueue.map((invite) => {
              const status = inviteStatuses[invite.id]
              return (
                <div key={invite.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{invite.playdateTitle}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {invite.fromFamily} · {formatDate(invite.date)} · {formatTime(invite.startTime)} · {invite.location}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">For {invite.childName}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={status === 'accepted' ? 'default' : 'outline'}
                      onClick={() => setInviteStatuses((current) => ({ ...current, [invite.id]: 'accepted' }))}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'maybe' ? 'default' : 'outline'}
                      onClick={() => setInviteStatuses((current) => ({ ...current, [invite.id]: 'maybe' }))}
                    >
                      Maybe
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'declined' ? 'destructive' : 'outline'}
                      onClick={() => setInviteStatuses((current) => ({ ...current, [invite.id]: 'declined' }))}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick plan a playdate</CardTitle>
            <CardDescription>Create a draft event directly from the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handlePlannerSubmit}>
              <div className="space-y-1">
                <Label htmlFor="planner-title">Title</Label>
                <Input
                  id="planner-title"
                  placeholder="After-school playground"
                  value={planner.title}
                  onChange={(event) => setPlanner((current) => ({ ...current, title: event.target.value }))}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="planner-date">Date</Label>
                  <Input
                    id="planner-date"
                    type="date"
                    value={planner.date}
                    onChange={(event) => setPlanner((current) => ({ ...current, date: event.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="planner-location">Location</Label>
                  <Input
                    id="planner-location"
                    placeholder="Riverside Playground"
                    value={planner.location}
                    onChange={(event) => setPlanner((current) => ({ ...current, location: event.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="planner-start">Start</Label>
                  <Input
                    id="planner-start"
                    type="time"
                    value={planner.startTime}
                    onChange={(event) =>
                      setPlanner((current) => ({
                        ...current,
                        startTime: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="planner-end">End</Label>
                  <Input
                    id="planner-end"
                    type="time"
                    value={planner.endTime}
                    onChange={(event) =>
                      setPlanner((current) => ({
                        ...current,
                        endTime: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Save draft playdate
              </Button>
              {plannerMessage && <p className="text-sm text-zinc-600 dark:text-zinc-400">{plannerMessage}</p>}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming schedule</CardTitle>
            <CardDescription>Everything currently on your calendar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedPlaydates.map((playdate) => (
              <div key={playdate.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{playdate.title}</p>
                  <span className="rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide">
                    {playdate.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatDate(playdate.date)} · {formatTime(playdate.startTime)}–{formatTime(playdate.endTime)}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{playdate.location}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Host: {playdate.hostFamily}
                  {playdate.attendees.length > 0 && ` · Kids: ${playdate.attendees.join(', ')}`}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Availability + match signals</CardTitle>
          <CardDescription>Keep your windows current to improve match quality.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Your availability</p>
            {seed.availability.map((window) => (
              <div key={window.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{window.childName}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{window.label}</p>
                {window.notes && <p className="mt-1 text-xs text-zinc-500">{window.notes}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Suggested overlaps</p>
            {seed.suggestedMatches.map((match) => (
              <div key={match.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{match.familyName}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{match.overlapLabel}</p>
                <p className="mt-1 text-xs text-zinc-500">{match.overlapDetail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
