import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import zafaran from "/src/assets/zafaran.png"
import {
  Leaf,
  BrainCircuit,
  ShieldCheck,
  Microscope,
  Star,
  ArrowRight,
  Zap,
  RefreshCw,
  Search,
  CheckCircle2,
  Globe,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { useQuery } from "@tanstack/react-query";
import { MOCK_BLOGS } from "../../data/mockBlogs";
import { getPlants } from "../../services/plant.service";

import heroVideo from "../../assets/heroVideo.mp4"

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'az';

  const isLoading = false;

  const [isLargeScreen, setIsLargeScreen] = React.useState(
    typeof window !== "undefined" ? window.innerWidth >= 992 : false
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: rawPlants } = useQuery({
    queryKey: ["allPlantsLanding"],
    queryFn: () => getPlants(),
    enabled: isLargeScreen,
  });

  const randomPlants = React.useMemo(() => {
    if (!rawPlants || rawPlants.length === 0) return [];
    const shuffled = [...rawPlants].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    return selected.map(plant => {
      const translation = plant.translations?.find(t => t.language === currentLang) || plant.translations?.[0];
      if (!translation) return plant;

      const merged = { ...plant };
      Object.keys(translation).forEach(key => {
        const val = translation[key];
        const isValid = Array.isArray(val) ? val.length > 0 : (val !== null && val !== undefined && val !== "");
        if (isValid) {
          merged[key] = val;
        }
      });
      return merged;
    });
  }, [rawPlants, currentLang]);

  const blogs = React.useMemo(() => {
    const allBlogs = MOCK_BLOGS.slice(0, 3);
    return allBlogs.map(blog => {
      const trans = blog.translations?.find(t => t.language === currentLang) || blog.translations?.[0];
      return {
        ...blog,
        title: trans?.title || blog.title,
        description: trans?.description || blog.description,
        category: trans?.category || blog.category
      };
    });
  }, [currentLang]);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full selection:bg-primary/20 bg-[#fafafa]">

      {/* 1. HERO SECTION */}
      <section className="w-full relative min-h-screen md:h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 md:py-0 overflow-hidden z-0">
        {/* Background Video */}
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-20"
        />

        {/* Dark overlay for contrast and premium aesthetic */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] -z-10"></div>

        <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 animate-fade-in-up z-10">
          <h1 className="text-3xl sm:text-4xl md:text-8xl font-display font-semibold tracking-tight text-white leading-[1.1] md:leading-[1.05]">
            {t('landing.hero.title_part1', 'Botanical Medicine')} <br />
            <span className="text-primary italic font-medium">{t('landing.hero.title_part2', 'Reimagined')}</span> {t('landing.hero.title_part3', 'by AI.')}
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto font-normal">
            {t('landing.hero.subtitle', "The world's first clinical-grade botanical ecosystem. Real-time safety analysis, lab-verified transparency, and genomic-backed health protocols.")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 md:pt-8">
            <Button size="lg" className="rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-semibold shadow-xl shadow-primary/20 btn-hover group shrink-0 whitespace-nowrap bg-primary text-white hover:bg-primary/95" asChild>
              <Link to="/register" className="flex items-center">
                {t('landing.cta.protocol', 'Start My Protocol')} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-semibold text-white hover:bg-white/10 hover:text-white shrink-0 whitespace-nowrap" asChild>
              <Link to="/marketplace">
                {t('landing.cta.marketplace', 'Explore The Marketplace')}
              </Link>
            </Button>
          </div>

          <div className="pt-10 md:pt-20 flex flex-col items-center space-y-4 md:space-y-6">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/60">{t('landing.social.trusted', 'Trusted by clinical researchers globally')}</p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-white opacity-40 grayscale contrast-125">
              <div className="font-display font-bold text-lg sm:text-2xl tracking-tighter italic">BioNature</div>
              <div className="font-display font-bold text-lg sm:text-2xl tracking-tighter">GenomicLabs</div>
              <div className="font-display font-bold text-lg sm:text-2xl tracking-tighter">EuroBotanics</div>
              <div className="font-display font-bold text-lg sm:text-2xl tracking-tighter italic">HelixHealth</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="w-full py-32 px-4 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4 text-left max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-[#1a1c1e]">
                {t('landing.value.title', 'Built for precision, driven by science.')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('landing.value.subtitle', 'Generic herbal advice is dangerous. Shafransa provides the clinical rigorousness required for modern health management.')}
              </p>
            </div>
            <Link to="/how-it-works" className="text-primary font-semibold flex items-center group mb-2">
              {t('landing.links.whitepaper', 'View the scientific whitepaper')} <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 premium-card p-10 h-[500px] flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 space-y-4">
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <BrainCircuit className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-display font-bold">{t('landing.ai.title', 'The Shafransa AI Core™')}</h3>
                <p className="text-muted-foreground text-lg max-w-md">{t('landing.ai.text', 'Our neural network analyzes your genetics, existing prescriptions, and symptoms to build a protocol that is safe, effective, and deeply personal.')}</p>
              </div>
            </div>

            <div className="premium-card p-10 h-[500px] flex flex-col justify-between bg-[#1a1c1e] text-white border-none">
              <div className="space-y-4">
                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-3xl font-display font-bold">{t('landing.verify.title', 'Verification Engine')}</h3>
                <p className="text-white/60 text-lg">{t('landing.verify.text', 'Blockchain-backed certificates of analysis for every single batch produced.')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.2 FEATURED BOTANICAL SPECIMENS (Hidden on viewport < 992px) */}
      {isLargeScreen && randomPlants && randomPlants.length > 0 && (
        <section className="hidden min-[992px]:block w-full py-32 px-4 bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-4">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold uppercase tracking-widest text-[10px] px-3">
                  {t('landing.plants.badge', 'Botanical Database')}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#1a1c1e]">
                  {t('landing.plants.title', 'Specimens of the Day')}
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                  {t('landing.plants.subtitle', 'A rotating selection of clinical-grade plants, validated for efficacy and safety.')}
                </p>
              </div>
              <Link to="/herbs" className="flex items-center gap-2 text-emerald-700 font-bold group">
                {t('landing.plants.view_all', 'Explore Encyclopedia')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {randomPlants.slice(0, 4).map((herb) => (
                <Link key={herb.id} to={`/herb/${herb.id}`} className="group block h-full">
                  <div className="h-full flex flex-col rounded-3xl overflow-hidden border border-neutral-100 bg-white hover:shadow-2xl hover:shadow-black/8 hover:border-emerald-200 transition-all duration-500">
                    {/* Image */}
                    <div className="relative aspect-square bg-[#f5f5f7] overflow-hidden flex-shrink-0">
                      {herb.evidenceGrade && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className={`font-bold text-[10px] shadow-sm ${
                            herb.evidenceGrade.startsWith("A") ? "bg-emerald-500 text-white border-none" :
                            herb.evidenceGrade.startsWith("B") ? "bg-blue-500 text-white border-none" :
                            "bg-amber-500 text-white border-none"
                          }`}>
                            {t('encyclopedia.grade', 'Grade')} {herb.evidenceGrade.trim().charAt(0)}
                          </Badge>
                        </div>
                      )}
                      {herb.image || herb.images?.[0] ? (
                        <img
                          src={herb.image || herb.images[0]}
                          alt={herb.localName || herb.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-14 h-14 text-emerald-200 stroke-1 group-hover:text-emerald-300 transition-colors" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-display font-bold text-lg text-[#1a1c1e] leading-tight group-hover:text-emerald-700 transition-colors">
                            {herb.localName || herb.name}
                          </h3>
                          {herb.localName && (herb.scientificName || herb.name) && (
                            <p className="text-xs italic text-muted-foreground mt-0.5">{herb.scientificName || herb.name}</p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {herb.shortSummary || herb.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2.5 LATEST BLOGS */}
      <section className="w-full py-32 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px] px-3">
                {t('landing.blog.badge', 'Knowledge Hub')}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#1a1c1e]">
                {t('landing.blog.title', 'Clinical Blogs & Protocols')}
              </h2>
            </div>
            <Link to="/blogs" className="hidden md:flex items-center gap-2 text-primary font-bold group">
              {t('landing.blog.view_all', 'Explore All')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="aspect-[16/10] rounded-3xl bg-neutral-100"></div>
                  <div className="h-4 bg-neutral-100 rounded w-1/4"></div>
                  <div className="h-6 bg-neutral-100 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-100 rounded w-full"></div>
                </div>
              ))
            ) : blogs.length > 0 ? (
              blogs.slice(0, 3).map((blog) => (
                <Link key={blog.id} to={`/blog/${blog.id}`} className="group cursor-pointer">
                  <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-neutral-100 relative">
                    {blog.images?.[0] ? (
                      <img
                        src={blog.images[0]}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-10 h-10 text-primary opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                    <span>{t('blog.min_read', { count: 5 })}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-200"></span>
                    <span className="text-muted-foreground">{t('common.protocol', 'PROTOCOL')}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#1a1c1e] mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {stripHtml(blog.description)}
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 opacity-40 italic">
                {t('blog.empty')}
              </div>
            )}
          </div>

          <Link to="/blogs" className="md:hidden flex items-center justify-center gap-2 text-primary font-bold mt-12 py-4 border border-primary/20 rounded-2xl">
            {t('landing.blog.view_all', 'Explore All Blogs')}
          </Link>
        </div>
      </section>

      {/* 3. FEATURE SHOWCASE */}
      <section className="w-full py-32 px-4 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <header className="space-y-4">
              <h4 className="text-primary font-bold uppercase tracking-[0.2em] text-sm">{t('landing.marketplace.badge', 'Clinical Marketplace')}</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#1a1c1e]">{t('landing.marketplace.title', 'Verified botanical purity from native soil to clinical wellness.')}</h2>
            </header>

            <div className="space-y-10">
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h5 className="text-xl font-bold">{t('landing.features.global.title', 'Global Sourcing')}</h5>
                  <p className="text-muted-foreground leading-relaxed">{t('landing.features.global.text', 'Direct relationships with organic growers in the Mediterranean, Amazon, and Caucasus mountains.')}</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h5 className="text-xl font-bold">{t('landing.features.escrow.title', 'Escrow Purity Guarantee')}</h5>
                  <p className="text-muted-foreground leading-relaxed">{t('landing.features.escrow.text', "Your payment is locked in our smart contract until a 3rd party lab verifies the batch's purity.")}</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <Microscope className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h5 className="text-xl font-bold">{t('landing.features.extraction.title', 'Standardized Extraction')}</h5>
                  <p className="text-muted-foreground leading-relaxed">{t('landing.features.extraction.text', 'We require CO2-critical extraction methods for maximum bioavailability and genomic absorption.')}</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="rounded-full h-14 px-8 btn-hover" asChild>
              <Link to="/marketplace">{t('landing.cta.explore_inventory', 'Explore Verified Inventory')}</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-neutral-200 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img
                src={zafaran}
                alt="Marketplace Interface"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 p-8 glass-dark rounded-3xl text-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">{t('landing.card.verified', 'Verified Origin')}</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30">{t('landing.card.location', 'Caucasian Mountains')}</Badge>
                </div>
                <h6 className="text-2xl font-display font-bold italic">{t('landing.card.product', 'Wildcrafted Saffron Extract')}</h6>
                <div className="flex items-center text-sm font-medium opacity-80 pt-2 border-t border-white/10 mt-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  {t('landing.card.rating_info', '4.9 Rating • Clinical Batch #AF-201')}
                </div>
              </div>
            </div>
            <div className="absolute -left-12 top-1/4 p-6 glass rounded-2xl shadow-2xl animate-bounce [animation-duration:4s]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">A</div>
                <div>
                  <div className="text-xs font-bold">{t('landing.floating.ai', 'AI Protocol Generated')}</div>
                  <div className="text-[10px] text-muted-foreground">{t('landing.floating.dose', 'Personalized Dose: 500mg')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE SOCIAL PROOF */}
      <section className="w-full py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">{t('landing.social.title', 'Health is the new wealth. Invest in precision.')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="text-left space-y-6 p-10 premium-card bg-neutral-50/50">
              <div className="flex text-yellow-500">
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
              </div>
              <p className="text-xl font-medium leading-relaxed">"{t('landing.testimonials.1.text', 'The interaction check between my prescriptions and Ashwagandha was a revelation. Every other platform missed what Shafransa caught.')}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200"></div>
                <div>
                  <div className="font-bold text-sm">Dr. Marcus Thorne</div>
                  <div className="text-xs text-muted-foreground">{t('landing.testimonials.1.role', 'Clinical Immunologist')}</div>
                </div>
              </div>
            </div>

            <div className="text-left space-y-6 p-10 premium-card bg-neutral-50/50">
              <div className="flex text-yellow-500">
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
                <Star className="fill-current w-4 h-4" />
              </div>
              <p className="text-xl font-medium leading-relaxed">"{t('landing.testimonials.2.text', 'Verified COAs change the game for sellers like us. We can finally prove our purity without expensive middlemen marketing.')}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200"></div>
                <div>
                  <div className="font-bold text-sm">BioNature Georgia</div>
                  <div className="text-xs text-muted-foreground">{t('landing.testimonials.2.role', 'Certified Organic Seller')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="w-full py-40 px-4 bg-[#1a1c1e] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter text-white">{t('landing.cta_final.title', 'Your healing starts with zero guesswork.')}</h2>
          <p className="text-white/60 text-xl md:text-2xl max-w-2xl mx-auto">{t('landing.cta_final.subtitle', 'Join the future of botanical science. Deploy your personalized protocol in minutes.')}</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button size="lg" className="rounded-full h-16 px-12 text-lg font-bold bg-white text-black hover:bg-white/90 btn-hover" asChild>
              <Link to="/register">{t('landing.cta_final.user', 'Join the Waitlist')}</Link>
            </Button>
            <Button size="lg" className="rounded-full h-16 px-12 text-lg font-bold bg-white text-black hover:bg-white/90 btn-hover" asChild>
              <Link to="/register">{t('landing.cta_final.seller', 'Become a Partner')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
