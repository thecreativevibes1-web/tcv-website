import { NavBar } from '@/components/ui/NavBar'
import { Hero } from '@/components/sections/Hero'
import { DeadVsLive } from '@/components/sections/DeadVsLive'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { Metrics } from '@/components/sections/Metrics'
import { CTA } from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <DeadVsLive />
        <Services />
        <Portfolio />
        <Metrics />
        <CTA />
      </main>
    </>
  )
}
