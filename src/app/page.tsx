import About from '@/components/About'
import Contact from '@/components/Contact'
import Experience from '@/components/Experience'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Philosophy from '@/components/Philosophy'
import Resume from '@/components/Resume'
import Skills from '@/components/Skills'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="portfolio">
        <Hero />
        <About />
        <Philosophy />
        <Skills />
        <Experience />
        <Resume />
        <Contact />
      </main>
    </>
  )
}
