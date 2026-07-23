import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Hero from '../components/home/Hero'
import { StatsBar, Partners } from '../components/home/StatsPartners'
import ServicesSection from '../components/home/ServicesSection'
import { FactorySection, CapabilitySection } from '../components/home/FactoryCapability'
import ProcessSection from '../components/home/ProcessSection'
import QuoteSection from '../components/home/QuoteSection'
import WhySection from '../components/home/WhySection'
import {
  CasesSection,
  Testimonials,
  Insights,
  Faq,
  CtaBand,
} from '../components/home/MoreSections'

/**
 * Homepage — React section tree + react-i18next `t()`.
 * Shared chrome comes from SiteLayout (App nested route).
 */
export default function Home() {
  const { t } = useTranslation()

  useEffect(() => {
    document.body.id = 'top'
    document.title = t('meta.title')

    return () => {
      document.body.classList.remove('is-why-scroll-active', 'is-services-active')
      document.body.removeAttribute('id')
    }
  }, [t])

  return (
    <main>
      <Hero />
      <StatsBar />
      <Partners />
      <ServicesSection />
      <FactorySection />
      <CapabilitySection />
      <ProcessSection />
      <QuoteSection />
      <WhySection />
      <CasesSection />
      <Testimonials />
      <Insights />
      <Faq />
      <CtaBand />
    </main>
  )
}
