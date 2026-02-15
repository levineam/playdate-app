export type DashboardPlaydateStatus = 'confirmed' | 'pending' | 'draft'

export interface DashboardPlaydate {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  hostFamily: string
  status: DashboardPlaydateStatus
  attendees: string[]
}

export interface DashboardInvite {
  id: string
  fromFamily: string
  playdateTitle: string
  date: string
  startTime: string
  location: string
  childName: string
  status: 'pending' | 'accepted' | 'declined' | 'maybe'
}

export interface DashboardAvailability {
  id: string
  childName: string
  label: string
  notes?: string
}

export interface DashboardMatch {
  id: string
  familyName: string
  overlapLabel: string
  overlapDetail: string
}

export interface DashboardSeed {
  familyName: string
  connectedFamilies: number
  connectedFamilyNames: string[]
  upcomingPlaydates: DashboardPlaydate[]
  inviteQueue: DashboardInvite[]
  availability: DashboardAvailability[]
  suggestedMatches: DashboardMatch[]
}

export const previewDashboardSeed: DashboardSeed = {
  familyName: 'The Levine Family',
  connectedFamilies: 6,
  connectedFamilyNames: [
    'The Patel Family',
    'The Nguyen Family',
    'The Carter Family',
    'The Rodriguez Family',
    'The Kim Family',
    'The Brooks Family',
  ],
  upcomingPlaydates: [
    {
      id: 'pd-1',
      title: 'Park hangout at Riverside',
      date: '2026-02-18',
      startTime: '15:30',
      endTime: '17:00',
      location: 'Riverside Playground',
      hostFamily: 'The Patel Family',
      status: 'confirmed',
      attendees: ['Noah', 'Mia', 'Rohan'],
    },
    {
      id: 'pd-2',
      title: 'LEGO + snacks',
      date: '2026-02-20',
      startTime: '16:00',
      endTime: '17:30',
      location: 'Your Home',
      hostFamily: 'The Levine Family',
      status: 'pending',
      attendees: ['Noah', 'Ava'],
    },
  ],
  inviteQueue: [
    {
      id: 'inv-1',
      fromFamily: 'The Nguyen Family',
      playdateTitle: 'Indoor climbing session',
      date: '2026-02-22',
      startTime: '10:00',
      location: 'ClimbZone Kids',
      childName: 'Noah',
      status: 'pending',
    },
    {
      id: 'inv-2',
      fromFamily: 'The Carter Family',
      playdateTitle: 'Storytime + crafts',
      date: '2026-02-24',
      startTime: '15:00',
      location: 'North Branch Library',
      childName: 'Mia',
      status: 'pending',
    },
  ],
  availability: [
    {
      id: 'av-1',
      childName: 'Noah',
      label: 'Mon & Wed · 15:30–17:30',
      notes: 'Prefers outdoor play when weather allows',
    },
    {
      id: 'av-2',
      childName: 'Mia',
      label: 'Sat · 10:00–12:00',
      notes: 'Works best with small groups (2–3 kids)',
    },
  ],
  suggestedMatches: [
    {
      id: 'match-1',
      familyName: 'The Rodriguez Family',
      overlapLabel: 'Wed · 16:00–17:00',
      overlapDetail: 'Noah overlaps with Lucas (age 7)',
    },
    {
      id: 'match-2',
      familyName: 'The Kim Family',
      overlapLabel: 'Sat · 10:00–11:30',
      overlapDetail: 'Mia overlaps with Hana (age 5)',
    },
  ],
}
