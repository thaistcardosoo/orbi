import { useState, useCallback } from "react";
import { Link } from "wouter";
import { MapPin, Briefcase, Building2, Users, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useListJobs, useListCompanies } from "@workspace/api-client-react";

interface StateConfig {
  abbreviation: string;
  name: string;
  headline: string;
  description: string;
  coverImage: string;
  cities: string[];
  highlights: { icon: string; label: string; value: string }[];
}

const SC_CONFIG: StateConfig = {
  abbreviation: "SC",
  name: "Santa Catarina",
  headline: "O ecossistema de tecnologia mais vibrante do Sul do Brasil",
  description:
    "De Florianópolis a Jaraguá do Sul, Santa Catarina reúne grandes empresas industriais em transformação digital, startups de govtech, e um mercado de tecnologia em rápida expansão. Com qualidade de vida excepcional e salários competitivos, SC atrai talentos de todo o Brasil.",
  coverImage:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=500&fit=crop",
  cities: [
    "Florianópolis",
    "Jaraguá do Sul",
    "Brusque",
    "Tijucas",
    "Joinville",
    "Blumenau",
  ],
  highlights: [
    { icon: "🏢", label: "Empresas de Tech", value: "500+" },
    { icon: "💼", label: "Vagas abertas", value: "2.400+" },
    { icon: "🎓", label: "Profissionais de TI", value: "45.000+" },
    { icon: "🌊", label: "Qualidade de vida", value: "Top 3 BR" },
  ],
};

const MODALITY_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
  { value: "presencial", label: "Presencial" },
];

const MODALITY_LABELS: Record<string, string> = {
  remoto: "Remoto",
  hibrido: "Híbrido",
  presencial: "Presencial",
};

const MODALITY_COLORS: Record<string, string> = {
  remoto: "bg-green-100 text-green-800 border-green-200",
  hibrido: "bg-blue-100 text-blue-800 border-blue-200",
  presencial: "bg-orange-100 text-orange-800 border-orange-200",
};

export default function StatePage() {
  const config = SC_CONFIG;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedModality, setSelectedModality] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      if (searchTimeout) clearTimeout(searchTimeout);
      const t = setTimeout(() => setDebouncedSearch(value), 300);
      setSearchTimeout(t);
    },
    [searchTimeout]
  );

  const { data: jobsData, isLoading: jobsLoading } = useListJobs({
    state: config.abbreviation,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedCity ? { location: selectedCity } : {}),
    ...(selectedModality ? { modality: selectedModality as "remoto" | "hibrido" | "presencial" } : {}),
    limit: 50,
  });

  const { data: companiesData } = useListCompanies({
    limit: 20,
  });

  const scCompanies = (companiesData?.companies ?? []).filter(
    (c) => c.state === config.abbreviation
  );

  const jobs = jobsData?.jobs ?? [];
  const total = jobsData?.total ?? 0;

  const hasActiveFilters = selectedCity || selectedModality || debouncedSearch;

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCity("");
    setSelectedModality("");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[340px] overflow-hidden">
        <img
          src={config.coverImage}
          alt={`${config.name} - tech`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                Santa Catarina, Brasil
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 max-w-2xl leading-tight">
              {config.headline}
            </h1>
            <p className="text-white/80 max-w-xl text-sm sm:text-base leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Highlights bar */}
      <div className="bg-foreground border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            {config.highlights.map((h) => (
              <div key={h.label} className="py-4 px-6 text-center">
                <div className="text-xl font-bold text-primary">{h.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SC Companies strip */}
      {scCompanies.length > 0 && (
        <div className="border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4 overflow-x-auto">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                Empresas em SC
              </span>
              {scCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/empresas/${company.id}`}
                  className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border border-border hover:border-primary hover:shadow-sm transition-all flex-shrink-0"
                >
                  {company.logo && (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {company.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Buscar vaga
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ex: Frontend, UX, Dados..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* City filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Cidade
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCity("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedCity === ""
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-border hover:border-foreground"
                    }`}
                  >
                    Todas
                  </button>
                  {config.cities.map((city) => (
                    <button
                      key={city}
                      onClick={() =>
                        setSelectedCity(selectedCity === city ? "" : city)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedCity === city
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:border-foreground"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedCity("remoto")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedCity === "remoto"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-green-50 text-green-800 border-green-200 hover:border-green-600"
                    }`}
                  >
                    Remoto
                  </button>
                </div>
              </div>

              {/* Modality filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Modalidade
                </label>
                <div className="space-y-1">
                  {MODALITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedModality(opt.value)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                        selectedModality === opt.value
                          ? "bg-foreground text-background"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {opt.value && (
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            opt.value === "remoto"
                              ? "bg-green-500"
                              : opt.value === "hibrido"
                              ? "bg-blue-500"
                              : "bg-orange-500"
                          }`}
                        />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Job list */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {jobsLoading ? (
                    <span className="inline-block w-20 h-5 bg-muted rounded animate-pulse" />
                  ) : (
                    <>
                      {total}{" "}
                      {total === 1 ? "vaga encontrada" : "vagas encontradas"}{" "}
                      em SC
                    </>
                  )}
                </h2>
                {(selectedCity || selectedModality) && (
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {selectedCity && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {selectedCity}
                      </Badge>
                    )}
                    {selectedModality && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${MODALITY_COLORS[selectedModality] ?? ""}`}
                      >
                        {MODALITY_LABELS[selectedModality]}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Jobs */}
            {jobsLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-muted rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Nenhuma vaga encontrada
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tente outros filtros ou explore todas as vagas.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-3" data-testid="sc-jobs-list">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Companies section */}
        {scCompanies.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Empresas contratando em SC
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Conheça quem está construindo o futuro de Santa Catarina
                </p>
              </div>
              <Link
                href="/empresas"
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/empresas/${company.id}`}
                  className="group block bg-background border border-border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-border"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{company.city}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {company.tagline}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>
                        {company.employeeCount?.toLocaleString("pt-BR")} pessoas
                      </span>
                    </div>
                    {typeof company.jobCount === "number" &&
                      company.jobCount > 0 && (
                        <span className="text-xs font-semibold text-primary">
                          {company.jobCount}{" "}
                          {company.jobCount === 1 ? "vaga" : "vagas"}
                        </span>
                      )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
