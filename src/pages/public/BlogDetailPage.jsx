import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useParams, Link } from "react-router-dom"
import { getBlog } from "../../services/blog.service"
import { Badge } from "../../components/ui/Badge"
import { Calendar, Clock, User, Share2, ArrowLeft, Loader2, BookOpen, Play } from "lucide-react"

export default function BlogDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()

  const { data: blogResponse, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlog(id),
  })

  const blog = blogResponse?.data || blogResponse

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('blog.loading_article', 'Loading article...')}</p>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
           <BookOpen className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[#1a1c1e]">{t('blog.not_found', 'Article not found')}</h2>
        <Link to="/blogs" className="text-primary font-bold hover:underline flex items-center gap-2">
           <ArrowLeft className="w-4 h-4" /> {t('blog.back_to_listing', 'Back to Blog')}
        </Link>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white pb-24">
      {/* Header Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-12 hover:-translate-x-1 transition-transform">
             <ArrowLeft className="w-4 h-4" /> {t('blog.back', 'Back to Hub')}
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-8">
               <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px] px-3">
                  {blog.category || t('blog.wellness', 'Wellness')}
               </Badge>
               <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
               </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-[#1a1c1e] tracking-tight leading-[1.1] mb-10">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between border-y border-neutral-100 py-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-primary font-bold text-lg">
                     {blog.author?.charAt(0) || 'S'}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-[#1a1c1e]">{blog.author || 'Shafransa Editorial'}</p>
                     <p className="text-xs text-muted-foreground font-medium">Health & Wellness Expert</p>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <button className="p-3 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-500 transition-colors">
                     <Share2 className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image or Gallery */}
      <div className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 gap-6">
          {blog.images?.[0] && (
            <div className="aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl shadow-neutral-200">
               <img src={blog.images[0]} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          {/* Gallery Grid if multiple images */}
          {blog.images?.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {blog.images.slice(1).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Video Section if available */}
          {blog.videoUrl && (
            <div className="mb-16 aspect-video rounded-[40px] overflow-hidden bg-black shadow-2xl relative group">
              <iframe 
                src={blog.videoUrl.replace('watch?v=', 'embed/')} 
                className="w-full h-full"
                allowFullScreen
                title="Video Content"
              />
            </div>
          )}

          <div 
            className="prose prose-lg prose-neutral max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:text-[#1a1c1e]
              prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-8
              prose-strong:text-[#1a1c1e] prose-strong:font-bold
              prose-img:rounded-3xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
          
          {/* Footer of article */}
          <footer className="mt-20 pt-10 border-t border-neutral-100">
             <div className="bg-neutral-50 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-primary text-4xl font-display font-bold shrink-0 shadow-sm">
                   S
                </div>
                <div>
                   <h4 className="text-xl font-display font-bold text-[#1a1c1e] mb-2">{t('blog.about_author', 'About Shafransa Editorial')}</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      Our editorial team consists of certified physiotherapists and herbalists dedicated to bringing you the most accurate and up-to-date health protocols based on both traditional wisdom and modern evidence.
                   </p>
                </div>
             </div>
          </footer>
        </div>
      </div>
    </article>
  )
}
