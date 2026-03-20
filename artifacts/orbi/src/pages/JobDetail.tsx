import { useParams, Link } from "wouter";
import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Building2, CheckCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useGetJob } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const MODALITY_LABELS: Record<string, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  hibrido: "Híbrido",
};

const MODALITY_COLORS: Record<string, string> = {
  remoto: "bg-green-50 text-green-700 border-green-200",
  hibrido: "bg-blue-50 text-blue-700 border-blue-200",
  presencial: "bg-orange-50 text-orange-700 border-orange-200",
};

const CONTRACT_LABELS: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  estagio: "Estágio",
  freelancer: "Freelancer",
};

const LEVEL_LABELS: Record<string, string> = {
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
};

function formatSalary(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null;
  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / mês`;
  if (min) return `A partir de ${fmt(min)} / mês`;
  if (max) return `Até ${fmt(max)} / mês`;
  return null;
}

export default function JobDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { toast } = useToast();

  const { data: job, isLoading, error } = useGetJob({ id });

  function handleApply() {
    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura foi registrada com sucesso. Boa sorte!",
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center" data-testid="job-not-found">
          <h2 className="text-2xl font-bold">Vaga não encontrada</h2>
          <Link href="/vagas">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver todas as vagas
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/vagas">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="button-back-jobs">
            <ArrowLeft className="w-4 h-4" />
            Voltar para vagas
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-card-border rounded-xl p-6" data-testid="job-header">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-muted-foreground">{job.companyName[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-black text-foreground leading-tight" data-testid="job-title">{job.title}</h1>
                  <Link href={`/empresas/${job.companyId}`}>
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer mt-1 inline-block" data-testid="job-company-name">
                      {job.companyName}
                    </span>
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${MODALITY_COLORS[job.modality] ?? "bg-gray-50 text-gray-700 border-gray-200"}`} data-testid="job-modality">
                  {MODALITY_LABELS[job.modality] ?? job.modality}
                </span>
                <Badge variant="secondary" data-testid="job-contract">{CONTRACT_LABELS[job.contractType] ?? job.contractType}</Badge>
                <Badge variant="secondary" data-testid="job-level">{LEVEL_LABELS[job.level] ?? job.level}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span data-testid="job-location">{job.city}, {job.state}</span>
                </div>
                {salary && (
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <DollarSign className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                    <span data-testid="job-salary">{salary}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3 flex-wrap">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                  onClick={handleApply}
                  data-testid="button-apply"
                >
                  Candidatar-se
                </Button>
                <Button variant="outline" size="lg" data-testid="button-save-job">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="ghost" size="lg" data-testid="button-share-job">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Description */}
            <section className="bg-card border border-card-border rounded-xl p-6" data-testid="job-description">
              <h2 className="text-lg font-bold text-foreground mb-4">Sobre a vaga</h2>
              <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section className="bg-card border border-card-border rounded-xl p-6" data-testid="job-requirements">
                <h2 className="text-lg font-bold text-foreground mb-4">Requisitos</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <section className="bg-card border border-card-border rounded-xl p-6" data-testid="job-benefits">
                <h2 className="text-lg font-bold text-foreground mb-4">Benefícios</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {job.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 px-3 bg-muted/50 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-primary rounded-xl p-5" data-testid="apply-cta-card">
              <h3 className="font-bold text-primary-foreground text-lg mb-1">Pronto para se candidatar?</h3>
              <p className="text-primary-foreground/70 text-sm mb-4">Crie um perfil grátis e candidate-se em segundos.</p>
              <Button
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
                onClick={handleApply}
                data-testid="button-apply-sidebar"
              >
                Candidatar-se agora
              </Button>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-5" data-testid="company-sidebar-card">
              <h3 className="font-bold text-foreground mb-4">Sobre a empresa</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-black text-muted-foreground">{job.companyName[0]}</span>
                  )}
                </div>
                <span className="font-semibold text-foreground">{job.companyName}</span>
              </div>
              <Link href={`/empresas/${job.companyId}`}>
                <Button variant="outline" className="w-full" data-testid="button-view-company">
                  <Building2 className="w-4 h-4 mr-2" />
                  Ver perfil da empresa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
