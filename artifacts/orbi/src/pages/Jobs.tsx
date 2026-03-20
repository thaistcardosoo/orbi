import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { useListJobs } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const MODALITIES = [
  { slug: "", label: "Todos" },
  { slug: "remoto", label: "Remoto" },
  { slug: "hibrido", label: "Híbrido" },
  { slug: "presencial", label: "Presencial" },
];

const CONTRACT_TYPES = [
  { slug: "", label: "Todos" },
  { slug: "clt", label: "CLT" },
  { slug: "pj", label: "PJ" },
  { slug: "estagio", label: "Estágio" },
  { slug: "freelancer", label: "Freelancer" },
];

const LEVELS = [
  { slug: "", label: "Todos" },
  { slug: "junior", label: "Júnior" },
  { slug: "pleno", label: "Pleno" },
  { slug: "senior", label: "Sênior" },
  { slug: "especialista", label: "Especialista" },
];

const CATEGORIES = [
  { slug: "", label: "Todas" },
  { slug: "tech", label: "Tech" },
  { slug: "marketing", label: "Marketing" },
  { slug: "design", label: "Design" },
  { slug: "produto", label: "Produto" },
  { slug: "dados", label: "Dados & IA" },
];

type FilterGroupProps = {
  label: string;
  options: { slug: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  testIdPrefix: string;
};

function FilterGroup({ label, options, value, onChange, testIdPrefix }: FilterGroupProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.slug}
            onClick={() => onChange(opt.slug)}
            data-testid={`filter-${testIdPrefix}-${opt.slug || "all"}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              value === opt.slug
                ? "bg-foreground text-background border-foreground"
                : "bg-card border-border hover:border-foreground/30 text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Jobs() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");

  const [search, setSearch] = useState(params.get("search") ?? "");
  const [modality, setModality] = useState("");
  const [contractType, setContractType] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useListJobs({
    search: search || undefined,
    modality: (modality as any) || undefined,
    contractType: (contractType as any) || undefined,
    level: (level as any) || undefined,
    category: category || undefined,
    limit: 20,
  });

  const jobs = data?.jobs ?? [];
  const total = data?.total ?? 0;
  const hasFilters = !!(search || modality || contractType || level || category);

  function clearFilters() {
    setSearch("");
    setModality("");
    setContractType("");
    setLevel("");
    setCategory("");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-primary py-12" data-testid="jobs-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-foreground">Vagas</h1>
          <p className="text-foreground/60 mt-2 text-lg">
            Encontre a vaga certa em empresas que combinam com você
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cargo, empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-jobs"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary" : ""}
            data-testid="button-toggle-job-filters"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} data-testid="button-clear-job-filters">
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-card border border-card-border rounded-xl p-5 mb-6 space-y-5" data-testid="filters-panel">
            <FilterGroup label="Modalidade" options={MODALITIES} value={modality} onChange={setModality} testIdPrefix="modality" />
            <FilterGroup label="Tipo de contrato" options={CONTRACT_TYPES} value={contractType} onChange={setContractType} testIdPrefix="contract" />
            <FilterGroup label="Nível" options={LEVELS} value={level} onChange={setLevel} testIdPrefix="level" />
            <FilterGroup label="Categoria" options={CATEGORIES} value={category} onChange={setCategory} testIdPrefix="category" />
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-5" data-testid="text-jobs-count">
          {isLoading ? "Carregando..." : `${total} ${total === 1 ? "vaga encontrada" : "vagas encontradas"}`}
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-5 animate-pulse h-36" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3" data-testid="jobs-list">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                companyLogo={job.companyLogo ?? undefined}
                salaryMin={job.salaryMin ?? undefined}
                salaryMax={job.salaryMax ?? undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" data-testid="empty-state-jobs">
            <p className="text-muted-foreground text-lg">Nenhuma vaga encontrada para esses filtros.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
