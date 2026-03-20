import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight, TrendingUp, Building2, Users, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyCard from "@/components/CompanyCard";
import JobCard from "@/components/JobCard";
import { useListCompanies, useListJobs, useGetStats, useListArticles } from "@workspace/api-client-react";

const POPULAR_SEARCHES = ["developer", "product manager", "designer", "marketing", "dados", "devops", "growth"];

const CATEGORIES = [
  { slug: "tech", label: "Tech", emoji: "💻" },
  { slug: "marketing", label: "Marketing", emoji: "📣" },
  { slug: "design", label: "Design", emoji: "🎨" },
  { slug: "produto", label: "Produto", emoji: "📦" },
  { slug: "dados", label: "Dados & IA", emoji: "📊" },
  { slug: "fintech", label: "Fintech", emoji: "💳" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();

  const { data: statsData } = useGetStats();
  const { data: featuredCompanies } = useListCompanies({ featured: true, limit: 6 });
  const { data: recentJobs } = useListJobs({ limit: 4 });
  const { data: articles } = useListArticles({ limit: 3 });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/vagas?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/vagas");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-foreground/20 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-foreground/10 translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-none tracking-tight" data-testid="hero-title">
              Encontre sua
              <br />
              <span className="underline decoration-4 underline-offset-4">tribo</span>.
            </h1>
            <p className="mt-6 text-xl text-foreground/70 max-w-xl" data-testid="hero-subtitle">
              {statsData?.totalJobs?.toLocaleString("pt-BR") ?? "..."} oportunidades em startups e empresas de tech no Brasil.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex gap-3 max-w-xl" data-testid="form-hero-search">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  type="search"
                  placeholder="Cargo, empresa ou palavra-chave..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 h-12 bg-white border-0 text-foreground placeholder:text-foreground/40 text-base shadow-sm"
                  data-testid="input-hero-search"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90 font-semibold" data-testid="button-hero-search">
                Buscar
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-foreground/50">Populares:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/vagas?search=${encodeURIComponent(term)}`)}
                  className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-2 cursor-pointer"
                  data-testid={`button-popular-search-${term}`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-foreground text-background" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, value: statsData?.totalJobs?.toLocaleString("pt-BR") ?? "0", label: "Vagas Abertas" },
              { icon: Building2, value: statsData?.totalCompanies?.toLocaleString("pt-BR") ?? "0", label: "Empresas" },
              { icon: Users, value: statsData?.totalCandidates?.toLocaleString("pt-BR") ?? "0", label: "Candidatos" },
              { icon: MapPin, value: statsData?.totalCities?.toLocaleString("pt-BR") ?? "0", label: "Cidades" },
            ].map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-3xl font-black text-background">{stat.value}</div>
                <div className="text-sm text-background/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="categories-section">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-foreground">Por categoria</h2>
          <Link href="/empresas">
            <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link href={`/empresas?category=${cat.slug}`} key={cat.slug} data-testid={`card-category-${cat.slug}`}>
              <div className="bg-card border border-card-border rounded-xl p-4 text-center hover:border-primary hover:shadow-sm transition-all cursor-pointer group">
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Companies */}
      <section className="bg-muted/30 py-16" data-testid="featured-companies-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-foreground">Empresas em destaque</h2>
              <p className="text-muted-foreground mt-1">Conheça as empresas que estão contratando agora</p>
            </div>
            <Link href="/empresas">
              <Button variant="outline" className="hidden md:flex items-center gap-2" data-testid="button-ver-empresas">
                Ver todas as empresas <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {featuredCompanies?.companies && featuredCompanies.companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCompanies.companies.map((company) => (
                <CompanyCard key={company.id} {...company} jobCount={company.jobCount ?? 0} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-card-border rounded-xl p-6 animate-pulse h-52" />
              ))}
            </div>
          )}

          <div className="mt-6 md:hidden text-center">
            <Link href="/empresas">
              <Button variant="outline" data-testid="button-ver-empresas-mobile">
                Ver todas as empresas <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="recent-jobs-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-foreground">Vagas recentes</h2>
            <p className="text-muted-foreground mt-1">Oportunidades publicadas agora</p>
          </div>
          <Link href="/vagas">
            <Button variant="outline" className="hidden md:flex items-center gap-2" data-testid="button-ver-vagas">
              Ver todas as vagas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {recentJobs?.jobs && recentJobs.jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.jobs.map((job) => (
              <JobCard key={job.id} {...job} companyLogo={job.companyLogo ?? undefined} salaryMin={job.salaryMin ?? undefined} salaryMax={job.salaryMax ?? undefined} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-5 animate-pulse h-36" />
            ))}
          </div>
        )}
      </section>

      {/* Articles */}
      {articles?.articles && articles.articles.length > 0 && (
        <section className="bg-foreground py-16" data-testid="articles-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-background">Conteúdo para sua carreira</h2>
                <p className="text-background/50 mt-1">Dicas, mercado e tendências do mundo tech</p>
              </div>
              <Link href="/artigos">
                <Button variant="outline" className="hidden md:flex border-background/20 text-background hover:bg-background/10" data-testid="button-ver-artigos">
                  Ver todos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.articles.map((article) => (
                <div key={article.id} className="bg-background/5 border border-background/10 rounded-xl overflow-hidden hover:bg-background/10 transition-colors cursor-pointer group" data-testid={`card-article-${article.id}`}>
                  {article.coverImage && (
                    <img src={article.coverImage} alt={article.title} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-5">
                    <Badge className="bg-primary text-primary-foreground text-xs mb-3">{article.category}</Badge>
                    <h3 className="font-bold text-background text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-background/50 mt-2 line-clamp-2">{article.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-background/40">
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.readTime} min de leitura</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" data-testid="cta-section">
        <div className="bg-primary rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-black text-foreground">Sua empresa contrata talento tech?</h2>
          <p className="text-foreground/70 mt-4 text-lg max-w-xl mx-auto">
            Crie o perfil da sua empresa, publique vagas e conecte-se com os melhores profissionais do Brasil.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-8" data-testid="button-cta-empresas">
              Criar perfil da empresa
            </Button>
            <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10 px-8" data-testid="button-cta-saibamais">
              Saiba mais
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
