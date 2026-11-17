import type { Metadata } from "next"

import ContactForm from "@/components/site/contact-form"
import { PageHead } from "@/components/site/ui"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Sponsor, mentor or invite FTC Team 8569 from NCSSM in Durham. Send us a message or email ftcteam8569@roboknights.net.",
  alternates: { canonical: "/contact" }
}

const reasons = [
  {
    title: "Sponsor us",
    body: "Sponsors and grants, including the Gene Haas Foundation and the NCSSM Foundation, keep the program running from one season to the next."
  },
  {
    title: "Mentor us",
    body: "Our mentors come from WarmHub, IBM, Intel and Rubrik, and we're always glad to learn from someone new."
  },
  {
    title: "Bring us to your school or event",
    body: "We've brought the robot to the Museum of Life & Science and the Durham Main Library, and we'd like to come to yours."
  }
]

export default function ContactPage() {
  return (
    <main>
      <PageHead
        title="Get in touch"
        sub="Sponsors, mentors, teams and schools: we'd love to hear from you."
      />
      <section className="section section--tight">
        <div className="wrap--media">
          <div className="grid grid--3">
            {reasons.map((reason) => (
              <article className="tile" key={reason.title} data-reveal>
                <h2 style={{ fontSize: 24, lineHeight: 1.17 }}>
                  {reason.title}
                </h2>
                <p className="body" style={{ marginTop: 10 }}>
                  {reason.body}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 72 }}>
          <div className="tile form-tile" data-reveal>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Send us a message</h2>
            <p className="body" style={{ marginTop: 8, marginBottom: 32 }}>
              It goes straight to the team inbox. We reply within a few days.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
