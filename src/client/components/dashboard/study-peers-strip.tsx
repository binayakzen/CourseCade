'use client'

import { Plus } from 'lucide-react'
import Image from 'next/image'
import type { StudyPeer } from '@/lib/api'

export function StudyPeersStrip({ peers }: { peers?: StudyPeer[] }) {
  const defaultPeers: StudyPeer[] = [
    { id: 1, name: 'Raven', avatar: '/avatars/avatar-1.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
    { id: 2, name: 'Nebula', avatar: '/avatars/avatar-2.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
    { id: 3, name: 'Phantom', avatar: '/avatars/avatar-3.png', online: false, monitoringStatus: 'Offline' },
    { id: 4, name: 'Specter', avatar: '/avatars/avatar-4.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
    { id: 5, name: 'Inferno', avatar: '/avatars/avatar-5.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
  ]

  const list = peers && peers.length > 0 ? peers : defaultPeers

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/60 flex items-center gap-6 overflow-x-auto">
      {/* Add Friends CTA */}
      <button className="flex flex-col items-center gap-1.5 group flex-shrink-0">
        <div className="size-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-[#a3e635] group-hover:text-black group-hover:border-transparent transition-all shadow-sm">
          <Plus className="size-6" />
        </div>
        <span className="text-xs font-bold text-gray-700 font-sans tracking-tight">Add Friends</span>
      </button>

      {/* Friends Avatars */}
      <div className="flex items-center gap-5">
        {list.map((peer) => (
          <div
            key={peer.id}
            className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0"
            title={`Telemetry: ${peer.monitoringStatus}`}
          >
            <div className="relative size-14 group-hover:scale-105 transition-transform">
              <div className="size-full rounded-full overflow-hidden bg-gray-100 border border-gray-200/80 shadow-sm relative">
                <Image
                  src={peer.avatar}
                  alt={peer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white z-10 shadow-sm ${peer.online ? 'bg-[#a3e635]' : 'bg-red-400'}`} />
            </div>
            <span className="text-xs font-bold text-gray-800 font-sans tracking-tight group-hover:text-black">{peer.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
