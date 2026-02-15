'use client'

import { FormEvent, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DashboardInvite,
  DashboardPlaydate,
  DashboardSeed,
} from '@/lib/dashboard-seed'

interface DashboardWorkspaceProps {
  seed: DashboardSeed
  previewMode: boolean
}

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

  const openInvites = useMemo(
    () => Object.values(inviteStatuses).filter((status) => status === 'pending').length,
    [inviteStatuses]
  )

  const sortedPlaydates = useMemo(() => sortPlaydates(playdates), [playdates])

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
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `draft-${Date.now()}`,
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
            <CardDescription>Availability windows</CardDescription>
            <CardTitle className="text-3xl">{seed.availability.length}</CardTitle>
          </CardHeader>
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
    </div>
  )
}
