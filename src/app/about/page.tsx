import type { Metadata } from 'next';
import { SparkleIcon, ShootingStarIcon, MoonStarsIcon, UsersIcon, HandHeartIcon, CloudMoonIcon, CloverIcon, PersonArmsSpreadIcon, HandsClappingIcon } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import BrushStroke from '@/components/BrushStroke';
import MoonPreview from '@/components/about/MoonPreview';
import EmailLink from '@/components/EmailLink';
import RandomSubheading from '@/components/about/RandomSubheading';
import { getMoonState } from '@/lib/moon';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About',
  description: 'Why Look on the Bright✦Side exists, how the moon shapes it, and how stories are found.',
  alternates: { canonical: '/about' },
};

const CONTENT = {
  title: 'About Bright✦Side',

  intro: [
    `For a while now, I've grown tired of the doom scrolling, the constant anxiety about the future, and the promotion of negativity both in the online space and in the real world. Cities don't feel like communities, towns don't feel like villages, policies aren't improving, and the globe is changing faster than we can prepare for. Everyone is so focused on everyone else or has given up hope a better future is possible. I don't want to see the world as doomed, I want to prove good still exists. That's the spark as to why I decided to create Bright✦Side. I want to make a difference, no matter how small.`,
    `I love connecting intentions and energy to the moon, attuning to her energy to daily life released tension and anxiety I had with the world around me. I want to bring that same feeling and intention with the core of this site. From the design, to the sounds, to the voice, everything about Bright✦Side inspires hope, optimism, positivity, and gratitude. The voices behind Bright✦Side were hand picked by me, and stories tailored to the messages that I think need to be spread the most.`,
  ],

  pillarsHeading: 'What Bright✦Side Stands For',
  pillars: [
    { label: 'Mission', icon: ShootingStarIcon, title: 'Igniting Sparks of Hope', body: 'Showing kindness and empathy first, to inspire those who need it most.' },
    { label: 'Vision', icon: SparkleIcon, title: 'A Brighter Tomorrow, Together', body: 'It takes a community effort to build a better future.' },
    { label: 'Values', icon: MoonStarsIcon, title: 'Optimism With Intention', body: `Darkness cannot live without light, reflection guides us towards success.` },
  ],

  valuesHeading: 'A Few Things I Hold To',
  values: [
    { title: 'humans first', icon: UsersIcon, color: 'red', body: `by design. humans use technology first. we can spread joy and empathy towards our communities and individuals.`},
    { title: 'honest hope', icon: HandHeartIcon, color: 'orange', body: 'sharing real action and credible sources. the last thing we need is false hope or misinformation. ' },
    { title: 'every phase matters', icon: CloudMoonIcon, color: 'yellow', body: `progress isn't made overnight, darkness makes way for the light. there is a time to reflect and a time to celebrate` },
    { title: 'empathy for our shared existence', icon: CloverIcon, color: 'green', body: 'humans, animals, plants, the oceans. we are connected to this earth and all that inhabit it.' },
    { title: 'accessible by default', icon: PersonArmsSpreadIcon, color: 'blue', body: 'accessibility is a human right, not an option. responsiveness and accessibility is the foundation.' },
    { title: 'hope into action', icon: HandsClappingIcon, color: 'purple', body: 'good news should leave you motivated to move forward together, not just scroll past.' },
  ],

  phasesHeading: 'Good News, Through Every Phase',
  phases: [
    `Bright✦Side follows the light of the moon. As the light grows, the front page features stories revolving around growth. During the full moon, we celebrate all we've accomplished while her light shines down on us. As the light dims, the featured stories shift to appreciate the effort we've done this far. Finally, as the last of the light fades and the cycle repeats, the new moon guides us towards reflective and somber stories. Bright✦Side never features content filled with despair, instead it features what still needs to be done or what can be done better. The site encourages you to take a mindful screen break, if you need it.`,
    <>
      Though, that&apos;s not the only moons worth mentioning. Rare astronomical events occur, and the site&apos;s look
      and its content changes slightly to celebrate fully or reflect deeply. During rare{' '}
      <strong className="text-secondary">Blue Moons</strong>, we look back on all the success stories of the year. As
      for the rare <strong className="text-eclipse">Lunar Eclipses</strong>, we reflect deeply on all the somber news
      over the last year. Take a look below to see what to expect during these insightful events.
    </>,
  ],
  phasesComeBack: 'the moon changes a little every night. so remember to come back to see what’s featured next.',

  findingHeading: 'How I Find Stories',
  finding: [
    `Bright✦Side doesn’t write the news it features, it gathers it through RSS feeds. I hand pick credible sources, from independent publishers to YouTube channels, I carefully review each source's terms to make sure I'm allowed to share their work. The feeds refresh every hour, and I don’t keep stories permanently. Every story links back to the original source, I don't take credit for their hard work.`,
    `The stories do go through a strict set of filters, to automatically tag and set the tone of each story, or filter ones out that do not fit the voice of Bright✦Side. There is no AI deciding what gets placed and when. I'm the one deciding what keywords to filter and which keywords set the categories. Though, the rules aren't perfect and it can get confused sometimes. If a story has the wrong lunar intention or category, please let me know and I'll fix it by hand.`,
  ],
  sourcesLink: 'see every source',
  contact: { user: 'brightside', domain: 'kokoneko.art' },
};

function Section({ id, heading, children }: { id: string; heading: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="about-section flex flex-col gap-4">
      <h2 id={id} className="lg-heading text-center md:text-left">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  const moon = getMoonState();

  return (
    <div className="about mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10">
      {/* Heading: same pattern as /news */}
      <hgroup className="flex flex-col gap-2">
        <RandomSubheading options={CONTENT.pillars.map((p) => p.title)} />
        <h1 className="xlg-heading">{CONTENT.title}</h1>
      </hgroup>

      {/* Intro: plain text, no box */}
      <div className="about-intro flex flex-col gap-4 text-body">
        {CONTENT.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Three pillars: the only boxes on the page */}
      <Section id="pillars" heading={CONTENT.pillarsHeading}>
        <ul role="list" className="pillars grid gap-10 mt-2.5 md:grid-cols-3">
          {CONTENT.pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
              <li
                key={pillar.label}
                className="pillar flex flex-col gap-2 rounded-xl items-center md:items-start bg-radial-[at_36%_11%] from-surface to-canvas px-6 py-5 shadow-card outline-2 outline-primary"
              >
                <p className="md-subheading flex gap-1 items-center text-center md:text-left"><IconComponent aria-hidden="true" size={24} weight="regular" />{pillar.label}</p>
                <h3 className="lg-heading text-center md:text-left">{pillar.title}</h3>
                <p className="text-body text-center md:text-left">{pillar.body}</p>
              </li>
          );
        })}
        </ul>
      </Section>

      {/* Values: a short list */}
      <Section id="values" heading={CONTENT.valuesHeading}>
        <ul role="list" className="values flex flex-col gap-3 text-body">
          {CONTENT.values.map((value) => {
            const IconComponent = value.icon;
            return (
              <li key={value.title}>
                <strong className={`md-heading flex gap-1 items-center text-${value.color}`}><IconComponent aria-hidden="true" size={24} weight="duotone" />{value.title}.</strong> {value.body}
              </li>
            );
        })}
        </ul>
      </Section>

      {/* Phases + interactive moon */}
      <Section id="phases" heading={CONTENT.phasesHeading}>
        {CONTENT.phases.map((p, i) => (
          <p key={i} className="text-body">
            {p}
          </p>
        ))}
        <div className="my-4">
          <MoonPreview tonight={moon} />
        </div>
        <p className="text-center text-accent">{CONTENT.phasesComeBack}</p>
      </Section>

      {/* How stories are found */}
      <Section id="finding" heading={CONTENT.findingHeading}>
        {CONTENT.finding.map((p, i) => (
          <p key={i} className="text-body">
            {p}
          </p>
        ))}
        <p className="flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/attribution" className="brush-link relative text-primary">
            {CONTENT.sourcesLink}
            <BrushStroke />
          </Link>
          <EmailLink
            user={CONTENT.contact.user}
            domain={CONTENT.contact.domain}
            subject="Misplaced story on Bright Side"
            className="brush-link relative text-primary"
          >
            report a misplaced story
            <BrushStroke />
          </EmailLink>
        </p>
      </Section>
    </div>
  );
}
