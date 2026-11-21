import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Footer from "@/components/footer";
import SectionHeading from "@/components/section-heading";
import SpaceNavigation from "@/components/space-navigation";

export const metadata = {
  title: "Contactos | NEETI",
  description: "Contactos do NEETI – Núcleo de Estudantes de Telecomunicações e Informática do IST.",
};

const EMAIL = "geral@neeti.tecnico.ulisboa.pt";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/neeti_ist/", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/NEETI.IST/", Icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/neerci?trk=company_logo", Icon: Linkedin },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCdpC_uftQikmRw3-N8fV2lg", Icon: Youtube },
];

const MEMBERS = [
  { name: "Madalena Bordadágua", role: "Presidente", email: "madalena.bordadagua@tecnico.ulisboa.pt" },
  { name: "Mariana Antunes", role: "Vice-Presidente", email: "marianacristinaanutunes@tecnico.ulisboa.pt" },
  { name: "Matilde Capelo", role: "Presidente da Assembleia Geral", email: "matilde.rocha.lopes@tecnico.ulisboa.pt" },
];

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1850.5135124809901!2d-9.304127876683609!3d38.736623270426016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecfb0af81d83f%3A0x5662866ed41a6d8c!2sInstituto%20Superior%20T%C3%A9cnico%20-%20Taguspark!5e0!3m2!1spt-PT!2spt!4v1752151453021!5m2!1spt-PT!2spt";
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Instituto+Superior+T%C3%A9cnico+Taguspark";

const iconCls = "mb-4 h-7 w-7";

export default function ContactosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cosmic-void)" }}>
      <SpaceNavigation />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32">
        <SectionHeading
          eyebrow="Contactos"
          title="Fala connosco."
          text="Para contactos de qualquer espécie, escreve-nos. Também estamos sempre à disposição na nossa sala."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6">
            <Mail className={iconCls} style={{ color: "var(--digital-cyan)" }} aria-hidden />
            <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--starlight)" }}>Email</h2>
            <a href={`mailto:${EMAIL}`} className="break-all hover:underline" style={{ color: "var(--starlight)" }}>
              {EMAIL}
            </a>
          </div>

          <div className="glass-card p-6">
            <MapPin className={iconCls} style={{ color: "var(--digital-cyan)" }} aria-hidden />
            <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--starlight)" }}>Onde estamos</h2>
            <p style={{ color: "var(--starlight)" }}>Sala 1.4.16, Campus do Taguspark do IST</p>
            <p className="mt-1 text-sm" style={{ color: "var(--tungsten-steel)" }}>
              Av. Prof. Doutor Cavaco Silva, 2744-016 Porto Salvo
            </p>
          </div>

          <div className="glass-card p-6">
            <Phone className={iconCls} style={{ color: "var(--digital-cyan)" }} aria-hidden />
            <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--starlight)" }}>Telefone</h2>
            <a href="tel:+351214233547" className="hover:underline" style={{ color: "var(--starlight)" }}>
              +351 214 233 547
            </a>
            <p className="mt-1 text-sm" style={{ color: "var(--tungsten-steel)" }}>Extensão 5147</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-lift flex items-center gap-2 px-5 py-3 text-sm font-semibold"
              style={{ color: "var(--starlight)" }}
            >
              <Icon className="h-4 w-4" style={{ color: "var(--digital-cyan)" }} aria-hidden />
              {label}
            </a>
          ))}
        </div>

        <div className="glass-card mt-12 overflow-hidden">
          <iframe
            title="Mapa: Instituto Superior Técnico – Taguspark"
            src={MAP_SRC}
            className="block h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <span style={{ color: "var(--tungsten-steel)" }}>IST – Campus do Taguspark</span>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="link-more">
              Abrir no Google Maps <span className="arrow">→</span>
            </a>
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Órgãos Sociais"
            title="Contactos específicos."
            text="Para informações mais específicas, podes usar os emails institucionais dos membros dos órgãos sociais."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MEMBERS.map((m) => (
              <div key={m.email} className="glass-card p-6">
                <p className="text-lg font-bold" style={{ color: "var(--starlight)" }}>{m.name}</p>
                <p className="mb-3 text-sm" style={{ color: "var(--digital-cyan)" }}>{m.role}</p>
                <a href={`mailto:${m.email}`} className="break-all text-sm hover:underline" style={{ color: "var(--tungsten-steel)" }}>
                  {m.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
