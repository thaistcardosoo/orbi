import { useParams, Link } from "wouter";
import { ArrowLeft, MapPin, Users, Calendar, Globe, Linkedin, Instagram, Heart, Briefcase, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { useGetCompany, useListJobs } from "@workspace/api-client-react";

const SIZE_LABELS: Record<string, string> = {
  startup: "Startup",
  pequena: "Pequena empresa",
  media: "Média empresa",
  grande: "Grande empresa",
};

function MediaGallery({ videoUrl, photos, companyName }: { videoUrl?: string | null; photos: string[]; companyName: string }) {
  const hasVideo = Boolean(videoUrl);
  const hasPhotos = photos.length > 0;

  if (!hasVideo && !hasPhotos) return null;

  if (hasVideo) {
    const sidePhotos = photos.slice(0, 2);
    const bottomPhotos = photos.slice(2, 5);
    return (
      <div className="w-full bg-foreground" data-testid="company-media-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="col-span-2 aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={videoUrl!}
                title={`${companyName} — vídeo`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {sidePhotos.length > 0 && (
              <div className="col-span-1 flex flex-col gap-3">
                {sidePhotos.map((photo, i) => (
                  <div key={i} className="flex-1 rounded-xl overflow-hidden bg-muted min-h-0">
                    <img src={photo} alt={`${companyName} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          {bottomPhotos.length > 0 && (
            <div className={`grid gap-3 ${bottomPhotos.length === 1 ? "grid-cols-1" : bottomPhotos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {bottomPhotos.map((photo, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <img src={photo} alt={`${companyName} foto ${i + 3}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-foreground" data-testid="company-media-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className={`grid gap-3 ${photos.length === 1 ? "grid-cols-1" : photos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {photos.slice(0, 5).map((photo, i) => (
            <div key={i} className={`aspect-video rounded-xl overflow-hidden bg-muted ${i === 0 && photos.length >= 3 ? "col-span-2" : ""}`}>
              <img src={photo} alt={`${companyName} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-muted/50 rounded-xl border border-border/30">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</div>
        <div className="text-foreground font-bold text-sm mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export default function CompanyProfile() {
  const params = useParams<{ slug: string }>();
  const id = Number(params.slug);

  const { data: company, isLoading, error } = useGetCompany(id);
  const { data: jobsData } = useListJobs({ companyId: id, limit: 10 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center" data-testid="company-not-found">
          <h2 className="text-2xl font-bold text-foreground">Empresa não encontrada</h2>
          <Link href="/empresas">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver todas as empresas
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const jobs = jobsData?.jobs ?? [];
  const hasMedia = Boolean(company.videoUrl) || (company.photos && company.photos.length > 0);
  const stats = [
    company.foundedYear ? { label: "Fundada em", value: company.foundedYear, icon: <Calendar className="w-4 h-4" /> } : null,
    company.employeeCount ? { label: "Colaboradores", value: company.employeeCount.toLocaleString("pt-BR"), icon: <Users className="w-4 h-4" /> } : null,
    company.genderRatio ? { label: "Paridade", value: company.genderRatio, icon: <UserCheck className="w-4 h-4" /> } : null,
    company.averageAge ? { label: "Média de idade", value: `${company.averageAge} anos`, icon: <Users className="w-4 h-4" /> } : null,
  ].filter(Boolean) as { label: string; value: string | number; icon: React.ReactNode }[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Editorial Media Gallery — above the fold */}
      {hasMedia && (
        <MediaGallery
          videoUrl={company.videoUrl}
          photos={company.photos ?? []}
          companyName={company.name}
        />
      )}

      {/* Fallback cover if no media */}
      {!hasMedia && (
        <div className="relative h-48 bg-muted overflow-hidden" data-testid="company-cover">
          {company.coverImage ? (
            <img src={company.coverImage} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-foreground/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company header */}
        <div className={`${hasMedia ? "pt-6" : "relative -mt-12"} mb-6`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0" data-testid="company-logo">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-muted-foreground">{company.name[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-foreground leading-tight" data-testid="company-name">{company.name}</h1>
                  <p className="text-muted-foreground text-base mt-1" data-testid="company-tagline">{company.tagline}</p>
                </div>
                <div className="flex gap-2 flex-wrap mt-1">
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" data-testid="button-company-website"><Globe className="w-4 h-4" /></Button>
                    </a>
                  )}
                  {company.linkedin && (
                    <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" data-testid="button-company-linkedin"><Linkedin className="w-4 h-4" /></Button>
                    </a>
                  )}
                  {company.instagram && (
                    <a href={company.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" data-testid="button-company-instagram"><Instagram className="w-4 h-4" /></Button>
                    </a>
                  )}
                  <Button variant="outline" className="flex items-center gap-2" data-testid="button-follow-company">
                    <Heart className="w-4 h-4" />
                    Seguir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        {stats.length > 0 && (
          <div className={`grid gap-3 mb-8 ${stats.length === 4 ? "grid-cols-2 md:grid-cols-4" : stats.length === 3 ? "grid-cols-1 sm:grid-cols-3" : stats.length === 2 ? "grid-cols-2" : "grid-cols-1"}`} data-testid="company-stats-bar">
            {stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section data-testid="company-about">
              <h2 className="text-xl font-bold text-foreground mb-4">Sobre a empresa</h2>
              <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{company.description}</p>
            </section>

            {/* Values */}
            {company.values && company.values.length > 0 && (
              <section data-testid="company-values">
                <h2 className="text-xl font-bold text-foreground mb-4">Valores</h2>
                <div className="flex flex-wrap gap-2">
                  {company.values.map((value) => (
                    <Badge key={value} variant="outline" className="text-sm py-1.5 px-3 border-foreground/20">
                      {value}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <section data-testid="company-benefits">
                <h2 className="text-xl font-bold text-foreground mb-4">Benefícios</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {company.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2.5 py-2 px-3 bg-muted/50 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Jobs */}
            <section data-testid="company-jobs-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Vagas abertas
                  {jobs.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">({jobs.length})</span>
                  )}
                </h2>
              </div>
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} {...job} companyLogo={job.companyLogo ?? undefined} salaryMin={job.salaryMin ?? undefined} salaryMax={job.salaryMax ?? undefined} />
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma vaga aberta no momento.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-xl p-5" data-testid="company-info-card">
              <h3 className="font-bold text-foreground mb-4">Informações</h3>
              <dl className="space-y-3">
                {company.foundedYear && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Fundada em</dt>
                      <dd className="text-sm font-medium text-foreground">{company.foundedYear}</dd>
                    </div>
                  </div>
                )}
                {company.employeeCount && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Colaboradores</dt>
                      <dd className="text-sm font-medium text-foreground">{company.employeeCount.toLocaleString("pt-BR")}</dd>
                    </div>
                  </div>
                )}
                {company.genderRatio && (
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Paridade</dt>
                      <dd className="text-sm font-medium text-foreground">{company.genderRatio}</dd>
                    </div>
                  </div>
                )}
                {company.averageAge && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Média de idade</dt>
                      <dd className="text-sm font-medium text-foreground">{company.averageAge} anos</dd>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Localização</dt>
                    <dd className="text-sm font-medium text-foreground">{company.city}, {company.state}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Porte</dt>
                    <dd className="text-sm font-medium text-foreground">{SIZE_LABELS[company.size] ?? company.size}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="bg-primary rounded-xl p-5" data-testid="company-cta-card">
              <h3 className="font-bold text-primary-foreground mb-2">Trabalhe nessa empresa</h3>
              <p className="text-primary-foreground/70 text-sm mb-4">Crie seu perfil e candidate-se às vagas abertas.</p>
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90" data-testid="button-create-profile">
                Criar perfil gratuito
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
