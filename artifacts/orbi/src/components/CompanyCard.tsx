import { Link } from "wouter";
import { MapPin, Users, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  id: number;
  slug: string;
  name: string;
  logo?: string | null;
  tagline: string;
  category: string;
  size: string;
  city: string;
  state: string;
  employeeCount?: number | null;
  jobCount: number;
  featured?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  tech: "Tech",
  marketing: "Marketing",
  design: "Design",
  produto: "Produto",
  dados: "Dados & IA",
  consultoria: "Consultoria",
  fintech: "Fintech",
  edtech: "Edtech",
  healthtech: "Healthtech",
};

const SIZE_LABELS: Record<string, string> = {
  startup: "Startup",
  pequena: "Pequena",
  media: "Média",
  grande: "Grande",
};

export default function CompanyCard({ id, slug, name, logo, tagline, category, size, city, state, employeeCount, jobCount, featured }: CompanyCardProps) {
  return (
    <Link href={`/empresas/${id}`} data-testid={`card-company-${id}`}>
      <div className="bg-card border border-card-border rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col group hover:border-primary/30">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {logo ? (
              <img src={logo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-black text-muted-foreground">{name[0]}</span>
            )}
          </div>
          {featured && (
            <Badge className="bg-primary text-primary-foreground text-xs font-semibold" data-testid={`badge-featured-${id}`}>
              Destaque
            </Badge>
          )}
        </div>

        <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors" data-testid={`text-company-name-${id}`}>
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 flex-1" data-testid={`text-company-tagline-${id}`}>
          {tagline}
        </p>

        <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span data-testid={`text-company-city-${id}`}>{city}, {state}</span>
          </div>
          {employeeCount && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{employeeCount.toLocaleString("pt-BR")} pessoas</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs font-medium text-primary ml-auto">
            <Briefcase className="w-3.5 h-3.5" />
            <span data-testid={`text-company-jobs-${id}`}>{jobCount} {jobCount === 1 ? "vaga" : "vagas"}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[category] ?? category}</Badge>
          <Badge variant="secondary" className="text-xs">{SIZE_LABELS[size] ?? size}</Badge>
        </div>
      </div>
    </Link>
  );
}
