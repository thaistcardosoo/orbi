import { useState } from "react";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useListArticles } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { slug: "", label: "Todos" },
  { slug: "Carreira", label: "Carreira" },
  { slug: "Mercado", label: "Mercado" },
  { slug: "Empresas", label: "Empresas" },
  { slug: "Tech", label: "Tech" },
];

export default function Articles() {
  const [category, setCategory] = useState("");
  const { toast } = useToast();

  const { data, isLoading } = useListArticles({
    category: category || undefined,
    limit: 20,
  });

  const articles = data?.articles ?? [];
  const [featured, ...rest] = articles;

  function handleReadMore() {
    toast({
      title: "Em breve!",
      description: "O conteúdo completo estará disponível em breve.",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground text-background py-12" data-testid="articles-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black">Conteúdo</h1>
          <p className="text-background/60 mt-2 text-lg">
            Dicas, tendências e insights do mercado tech brasileiro
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8" data-testid="article-category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              data-testid={`filter-article-category-${cat.slug || "all"}`}
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-state-articles">
            <p className="text-muted-foreground text-lg">Nenhum artigo encontrado.</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && !category && (
              <div
                className="bg-card border border-card-border rounded-2xl overflow-hidden mb-8 cursor-pointer group hover:shadow-md transition-shadow"
                onClick={handleReadMore}
                data-testid={`card-article-featured-${featured.id}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {featured.coverImage && (
                    <div className="h-56 md:h-full overflow-hidden">
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="bg-primary text-primary-foreground text-xs w-fit mb-4">{featured.category}</Badge>
                    <h2 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground mt-3 line-clamp-3">{featured.excerpt}</p>
                    <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                      {featured.authorAvatar && (
                        <img src={featured.authorAvatar} alt={featured.author} className="w-8 h-8 rounded-full object-cover" />
                      )}
                      <div>
                        <span className="text-foreground font-medium">{featured.author}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{featured.readTime} min de leitura</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="articles-grid">
              {(category ? articles : rest).map((article) => (
                <div
                  key={article.id}
                  className="bg-card border border-card-border rounded-xl overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
                  onClick={handleReadMore}
                  data-testid={`card-article-${article.id}`}
                >
                  {article.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <Badge className="bg-primary text-primary-foreground text-xs mb-3">{article.category}</Badge>
                    <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      {article.authorAvatar ? (
                        <img src={article.authorAvatar} alt={article.author} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="text-foreground font-medium">{article.author}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
