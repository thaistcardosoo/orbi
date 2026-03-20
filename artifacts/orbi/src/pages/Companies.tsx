import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyCard from "@/components/CompanyCard";
import { useListCompanies } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const CATEGORIES = [
  { slug: "", label: "Todas" },
  { slug: "tech", label: "Tech" },
  { slug: "fintech", label: "Fintech" },
  { slug: "marketing", label: "Marketing" },
  { slug: "design", label: "Design" },
  { slug: "produto", label: "Produto" },
  { slug: "dados", label: "Dados & IA" },
  { slug: "consultoria", label: "Consultoria" },
  { slug: "edtech", label: "Edtech" },
  { slug: "healthtech", label: "Healthtech" },
];

const SIZES = [
  { slug: "", label: "Todos tamanhos" },
  { slug: "startup", label: "Startup" },
  { slug: "pequena", label: "Pequena" },
  { slug: "media", label: "Média" },
  { slug: "grande", label: "Grande" },
];

export default function Companies() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [size, setSize] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useListCompanies({
    search: search || undefined,
    category: category || undefined,
    size: (size as any) || undefined,
    limit: 24,
  });

  const companies = data?.companies ?? [];
  const total = data?.total ?? 0;

  function clearFilters() {
    setSearch("");
    setCategory("");
    setSize("");
  }

  const hasActiveFilters = !!(search || category || size);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground text-background py-12" data-testid="companies-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black">Empresas</h1>
          <p className="text-background/60 mt-2 text-lg">
            Conheça as empresas que estão transformando o mercado tech brasileiro
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar empresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search-companies"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "border-primary" : ""}
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} data-testid="button-clear-filters">
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap" data-testid="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                data-testid={`filter-category-${cat.slug || "all"}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  category === cat.slug
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:border-foreground/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Size filter */}
          {showFilters && (
            <div className="flex gap-2 flex-wrap items-center" data-testid="size-filters">
              <span className="text-sm text-muted-foreground font-medium">Porte:</span>
              {SIZES.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setSize(s.slug)}
                  data-testid={`filter-size-${s.slug || "all"}`}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    size === s.slug
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-foreground/30"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6" data-testid="text-results-count">
          {isLoading ? "Carregando..." : `${total} ${total === 1 ? "empresa encontrada" : "empresas encontradas"}`}
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-6 animate-pulse h-52" />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="companies-grid">
            {companies.map((company) => (
              <CompanyCard key={company.id} {...company} jobCount={company.jobCount ?? 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" data-testid="empty-state-companies">
            <p className="text-muted-foreground text-lg">Nenhuma empresa encontrada.</p>
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
