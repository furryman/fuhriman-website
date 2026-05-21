import About from '@/components/About'
import Contact from '@/components/Contact'
import Experience from '@/components/Experience'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Interests from '@/components/Interests'
import Navbar from '@/components/Navbar'
import Philosophy from '@/components/Philosophy'
import Projects from '@/components/Projects'
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
        <Projects />
        <Interests />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
