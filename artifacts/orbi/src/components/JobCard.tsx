import { Link } from "wouter";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  id: number;
  title: string;
  companyId: number;
  companyName: string;
  companyLogo?: string | null;
  city: string;
  state: string;
  modality: string;
  contractType: string;
  level: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  featured?: boolean;
  createdAt: string;
}

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

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem. atrás`;
  return `${Math.floor(diffDays / 30)} mês atrás`;
}

function formatSalary(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null;
  const fmt = (v: number) =>
    v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${v.toLocaleString("pt-BR")}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `A partir de ${fmt(min)}`;
  if (max) return `Até ${fmt(max)}`;
  return null;
}

export default function JobCard({ id, title, companyId, companyName, companyLogo, city, state, modality, contractType, level, salaryMin, salaryMax, featured, createdAt }: JobCardProps) {
  const salary = formatSalary(salaryMin, salaryMax);

  return (
    <Link href={`/vagas/${id}`} data-testid={`card-job-${id}`}>
      <div className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-primary/30 relative">
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground text-xs" data-testid={`badge-featured-job-${id}`}>
              Destaque
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-black text-muted-foreground">{companyName?.[0] ?? "?"}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors pr-16" data-testid={`text-job-title-${id}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5" data-testid={`text-job-company-${id}`}>
              {companyName}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${MODALITY_COLORS[modality] ?? "bg-gray-50 text-gray-700 border-gray-200"}`} data-testid={`badge-modality-${id}`}>
            {MODALITY_LABELS[modality] ?? modality}
          </span>
          <Badge variant="secondary" className="text-xs">{CONTRACT_LABELS[contractType] ?? contractType}</Badge>
          <Badge variant="secondary" className="text-xs">{LEVEL_LABELS[level] ?? level}</Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span data-testid={`text-job-location-${id}`}>{city}, {state}</span>
          </span>
          {salary && (
            <span className="flex items-center gap-1 text-foreground font-medium">
              <DollarSign className="w-3.5 h-3.5" />
              <span data-testid={`text-job-salary-${id}`}>{salary}</span>
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
