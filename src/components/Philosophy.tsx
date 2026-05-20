import ScrollReveal from '@/components/ScrollReveal'
import styles from './Philosophy.module.css'

const philosophies = [
  {
    title: 'Culture Over Tools',
    description:
      "DevOps isn't just about tools — it's about people. A culture of collaboration, open communication, and trust is essential for teams to innovate and deliver effectively.",
  },
  {
    title: 'Automate Everything',
    description:
      'Freeing teams from repetitive tasks reduces human error and lets them focus on delivering value — leading to higher job satisfaction and happier customers.',
  },
  {
    title: 'Practical AI',
    description:
      'I embrace AI thoughtfully as a tool for augmenting human capability, not replacing human judgment.',
  },
]

export default function Philosophy() {
  return (
    <section id="philosophy" className={styles.philosophy}>
      <div className="container">
        <ScrollReveal>
          <h2>Philosophy</h2>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.grid}>
            {philosophies.map((item, index) => (
              <div key={item.title} className={styles.card}>
                <span className={styles.cardNumber}>0{index + 1}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
