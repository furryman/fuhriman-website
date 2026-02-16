import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Philosophy from '@/components/Philosophy'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Resume from '@/components/Resume'
import Contact from '@/components/Contact'

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
