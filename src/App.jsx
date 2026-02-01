import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // Ref for the tall scroll container
  const heroContainerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showProductsMenu, setShowProductsMenu] = useState(false)
  const productsMenuRef = useRef(null)
  // State for the products section active tab
  const [activeProduct, setActiveProduct] = useState('evaluate')

  useEffect(() => {
    // Optimized scroll handler using requestAnimationFrame
    let rafId = null
    
    const handleScroll = () => {
      if (rafId) return
      
      rafId = requestAnimationFrame(() => {
        if (!heroContainerRef.current) {
          rafId = null
          return
        }

        // Get scroll position relative to hero container
        const container = heroContainerRef.current
        const containerRect = container.getBoundingClientRect()
        const containerHeight = container.offsetHeight
        const viewportHeight = window.innerHeight
        
        // Calculate scroll progress: 0 when container top is at viewport top, 1 when scrolled past
        // The scroll range is the container height minus viewport (the sticky section stays for this range)
        const scrollRange = containerHeight - viewportHeight
        
        // Progress: how far we've scrolled through the container
        // When container top is at viewport top: progress = 0
        // When container bottom is at viewport top: progress = 1
        const scrollY = window.scrollY
        const containerTop = container.offsetTop
        const scrolled = scrollY - containerTop
        
        // Progress from 0 to 1 over the scroll range
        const progress = scrollRange > 0 
          ? Math.max(0, Math.min(1, scrolled / scrollRange))
          : 0
        
        setScrollProgress(progress)
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // 3D Transform calculations based on scroll progress
  // Start: tilted (-12deg), pushed forward (300px), slightly scaled (1.06)
  // End: flat (0deg), natural position (0px), normal scale (1.0)
  const rotateX = -12 + scrollProgress * 12
  const translateZ = 300 - scrollProgress * 300
  const scale = 1.06 - scrollProgress * 0.06

  // Navbar and text fade out faster (disappear by 70% scroll)
  const navOpacity = Math.max(0, 1 - scrollProgress * 1.4)
  const navY = -scrollProgress * 40
  const textOpacity = Math.max(0, 1 - scrollProgress * 1.4)
  const textY = -scrollProgress * 60

  return (
    <div className="min-h-screen relative">
      {/* TALL SCROLL CONTAINER: Creates scroll range for hero animation (500vh = 5x viewport) */}
      <section 
        ref={heroContainerRef}
        className="relative h-[500vh]"
      >
        {/* STICKY HERO SECTION: Stays fixed until scroll completes */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* 3D Perspective Container */}
          <div 
            className="absolute inset-0"
            style={{
              perspective: '1000px',
              perspectiveOrigin: 'center bottom',
            }}
          >
            {/* Hero Image with 3D Transform */}
            <img
              src="/adakine.jpg"
              alt="Hero scene"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: `
                  perspective(1000px)
                  rotateX(${rotateX}deg)
                  translateZ(${translateZ}px)
                  scale(${scale})
                `,
                transformOrigin: 'center bottom',
                willChange: 'transform',
              }}
            />

            {/* Subtle depth overlay */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header (nav) - fades out and moves up */}
            <header
              className="pointer-events-auto sticky top-0 right-0 left-0 z-20"
              style={{ 
                opacity: navOpacity,
                transform: `translateY(${navY}px)`,
                willChange: 'opacity, transform',
              }}
            >
          <div className="h-16 relative shadow-[0_1px_0_0_rgba(0,0,0,0.06)] transition-shadow duration-200">
            <div className="absolute inset-0 z-20 flex flex-row items-center justify-center px-12 lg:px-16 xl:px-24">
              <nav className="flex flex-1 items-center gap-8 lg:gap-12">
                {/* Left Navigation */}
                <div className="flex flex-1 items-center gap-8 text-xs md:text-sm">
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowProductsMenu(true)}
                    onMouseLeave={() => setShowProductsMenu(false)}
                    ref={productsMenuRef}
                  >
                    <button
                      className="text-black font-medium hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                      PRODUCTS
                      <svg
                        className={`w-3 h-3 transition-transform duration-300 ${showProductsMenu ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Products Dropdown Menu */}
                    {showProductsMenu && (
                      <div className="absolute top-full left-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden z-50 opacity-animation">
                        <div className="w-100rem min-w-max p-8">
                          {/* Horizontal layout of 4 products */}
                          <div className="flex gap-12 items-start justify-start">
                            {/* ITERATE */}
                            <div className="product-item group cursor-pointer flex-shrink-0 w-48">
                              <div className="relative h-40 mb-6 flex items-center justify-center overflow-hidden">
                                <svg className="w-32 h-32 text-gray-200 group-hover:text-adaline-green transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
                                  <circle cx="50" cy="50" r="30" className="circle-outer" />
                                  <circle cx="50" cy="50" r="20" className="circle-mid" />
                                  <circle cx="50" cy="50" r="10" className="circle-inner" />
                                  <circle cx="50" cy="20" r="4" className="circle-dot" />
                                  <circle cx="70" cy="50" r="3" className="circle-dot" />
                                  <circle cx="50" cy="80" r="3" className="circle-dot" />
                                  <circle cx="30" cy="50" r="3" className="circle-dot" />
                                </svg>
                              </div>
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">1 ITERATE</div>
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-adaline-green transition-colors duration-300">Sketch, test and refine</h4>
                                <div className="space-y-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                  <div>Editor</div>
                                  <div>Playground</div>
                                  <div>Datasets</div>
                                </div>
                              </div>
                            </div>

                            {/* EVALUATE */}
                            <div className="product-item group cursor-pointer flex-shrink-0 w-48">
                              <div className="relative h-40 mb-6 flex items-center justify-center overflow-hidden">
                                <svg className="w-32 h-32 text-gray-200 group-hover:text-adaline-green transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
                                  <circle cx="40" cy="40" r="25" className="circle-outer" />
                                  <circle cx="60" cy="60" r="20" className="circle-outer" opacity="0.7" />
                                  <circle cx="50" cy="30" r="15" className="circle-mid" opacity="0.8" />
                                  <circle cx="40" cy="40" r="8" className="circle-inner" />
                                </svg>
                              </div>
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">2 EVALUATE</div>
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-adaline-green transition-colors duration-300">Reflect and measure</h4>
                                <div className="space-y-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                  <div>Evaluations</div>
                                  <div>Datasets</div>
                                </div>
                              </div>
                            </div>

                            {/* DEPLOY */}
                            <div className="product-item group cursor-pointer flex-shrink-0 w-48">
                              <div className="relative h-40 mb-6 flex items-center justify-center overflow-hidden">
                                <svg className="w-32 h-32 text-gray-200 group-hover:text-adaline-green transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
                                  <circle cx="50" cy="50" r="35" className="circle-outer" />
                                  <circle cx="50" cy="50" r="22" className="circle-mid" />
                                  <circle cx="50" cy="50" r="10" className="circle-inner" />
                                  <circle cx="50" cy="15" r="2" className="circle-dot" />
                                  <circle cx="85" cy="50" r="2" className="circle-dot" />
                                  <circle cx="50" cy="85" r="2" className="circle-dot" />
                                  <circle cx="15" cy="50" r="2" className="circle-dot" />
                                </svg>
                              </div>
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">3 DEPLOY</div>
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-adaline-green transition-colors duration-300">From draft to live</h4>
                                <div className="space-y-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                  <div>Deployments</div>
                                  <div>Analytics</div>
                                  <div>Gateway ↗</div>
                                </div>
                              </div>
                            </div>

                            {/* MONITOR */}
                            <div className="product-item group cursor-pointer flex-shrink-0 w-48">
                              <div className="relative h-40 mb-6 flex items-center justify-center overflow-hidden">
                                <svg className="w-32 h-32 text-gray-200 group-hover:text-adaline-green transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
                                  <circle cx="30" cy="30" r="18" className="circle-outer" />
                                  <circle cx="70" cy="30" r="18" className="circle-outer" />
                                  <circle cx="50" cy="70" r="22" className="circle-outer" />
                                  <circle cx="30" cy="30" r="10" className="circle-mid" />
                                  <circle cx="70" cy="30" r="10" className="circle-mid" />
                                  <circle cx="50" cy="70" r="12" className="circle-mid" />
                                </svg>
                              </div>
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">4 MONITOR</div>
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-adaline-green transition-colors duration-300">Insights in real time</h4>
                                <div className="space-y-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                  <div>Logs</div>
                                  <div>Analytics</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <a
                    href="#"
                    className="text-black font-medium hover:opacity-80 transition-opacity"
                  >
                    PRICING
                  </a>
                  <a
                    href="#"
                    className="text-black font-medium hover:opacity-80 transition-opacity"
                  >
                    BLOG
                  </a>
                </div>

                {/* Center Logo */}
                <a
                  href="#"
                  aria-label="Adaline Homepage"
                  className="flex-none overflow-hidden"
                  style={{ width: 'auto' }}
                >
                  <img
                    src="/adaline-.png"
                    alt="Adaline"
                    className="h-14"
                  />
                </a>

                {/* Right Buttons */}
                <div className="flex flex-1 items-center justify-end gap-4 text-xs md:text-sm">
                  <button className="text-adaline-green font-medium border  bg-adaline-beige px-4 py-2 rounded-3xl hover:opacity-80 transition-opacity flex items-center gap-2 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    WATCH DEMO
                  </button>
                  <button className="text-white font-medium bg-adaline-green px-4 py-2 rounded-3xl hover:opacity-90 transition-opacity shadow-sm">
                    START FOR FREE
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </header>

            {/* Hero Text - centered, fades out and moves up */}
            <div 
              className="flex-1 flex flex-col items-center  pt-28 px-6"
              style={{ 
                opacity: textOpacity,
                transform: `translateY(${textY}px)`,
                willChange: 'opacity, transform',
              }}
            >
              <h1 className="text-black text-1xl md:text-2xl lg:text-4xl font-bold text-center max-w-5xl leading-tight mb-8">
                The single platform to iterate, evaluate, deploy, and monitor AI agents.
              </h1>

              {/* Trusted By Section */}
              <div className="flex flex-col items-center gap-8">
            <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">
              TRUSTED BY
            </p>
            
            {/* Company Logos - Horizontal Scrolling */}
            <div className="grid grid-cols-12 w-full">
              <div 
                className="col-span-12 flex h-16 items-center lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3 overflow-hidden"
                aria-label="Customers like Salesforce, DoorDash, HubSpot, Discord and McKinsey and Company"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
                }}
              >
                <div className="logos-scroll flex items-center gap-16 whitespace-nowrap">
                  {/* First set of logos */}
                  <div className="flex items-center gap-16 pr-16 flex-shrink-0">
                    <div className="text-gray-400 text-sm font-medium">Kinsey & Company</div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-adaline-green" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">salesforce</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">Discord</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">HubSpot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <span className="text-black text-sm font-medium">Jusbrasil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l6 3v7.64l-6 3-6-3V7.18l6-3z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">DOORDASH</span>
                    </div>
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="flex items-center gap-16 flex-shrink-0">
                    <div className="text-gray-400 text-sm font-medium">Kinsey & Company</div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-adaline-green" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">salesforce</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">Discord</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">HubSpot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <span className="text-black text-sm font-medium">Jusbrasil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l6 3v7.64l-6 3-6-3V7.18l6-3z"/>
                      </svg>
                      <span className="text-black text-sm font-medium">DOORDASH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NORMAL PAGE SECTIONS: Appear after hero animation completes */}
      <main className="relative bg-gradient-to-b from-adaline-beige via-white to-white">
        {/* PRODUCTS SECTION: Iterate / Evaluate / Deploy / Monitor */}
        <section className="w-full py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Visual Diagrams Row */}
            <div className="grid grid-cols-4 gap-8 mb-16">
              {/* ITERATE Diagram */}
              <div
                className="flex flex-col items-center cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveProduct('iterate')}
              >
                <div className={`h-48 flex items-center justify-center transition-all duration-300 ${
                  activeProduct === 'iterate' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                }`}>
                  <svg viewBox="0 0 120 120" className="w-40 h-40">
                    {/* Outer circle cluster */}
                    <circle cx="30" cy="30" r="22" fill="none" stroke={activeProduct === 'iterate' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    <circle cx="70" cy="30" r="18" fill="none" stroke={activeProduct === 'iterate' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    <circle cx="20" cy="70" r="20" fill="none" stroke={activeProduct === 'iterate' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    <circle cx="70" cy="75" r="25" fill="none" stroke={activeProduct === 'iterate' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5" strokeDasharray="4,3"/>
                    
                    {/* Plus signs */}
                    <text x="30" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill={activeProduct === 'iterate' ? '#22c55e' : '#9ca3af'} fontWeight="300">+</text>
                    <text x="70" y="30" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={activeProduct === 'iterate' ? '#22c55e' : '#9ca3af'} fontWeight="300">+</text>
                    <text x="20" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={activeProduct === 'iterate' ? '#22c55e' : '#9ca3af'} fontWeight="300">+</text>
                  </svg>
                </div>
              </div>

              {/* EVALUATE Diagram */}
              <div
                className="flex flex-col items-center cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveProduct('evaluate')}
              >
                <div className={`h-48 flex items-center justify-center transition-all duration-300 ${
                  activeProduct === 'evaluate' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                }`}>
                  <svg viewBox="0 0 120 120" className="w-40 h-40">
                    {/* Overlapping circles */}
                    <circle cx="35" cy="35" r="28" fill="none" stroke={activeProduct === 'evaluate' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5" strokeDasharray="4,3"/>
                    <circle cx="65" cy="35" r="24" fill="none" stroke={activeProduct === 'evaluate' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    <circle cx="50" cy="70" r="26" fill="none" stroke={activeProduct === 'evaluate' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    
                    {/* Plus signs */}
                    <text x="35" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill={activeProduct === 'evaluate' ? '#22c55e' : '#9ca3af'} fontWeight="300">+</text>
                    <text x="65" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill={activeProduct === 'evaluate' ? '#22c55e' : '#9ca3af'} fontWeight="300">+</text>
                  </svg>
                </div>
              </div>

              {/* DEPLOY Diagram */}
              <div
                className="flex flex-col items-center cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveProduct('deploy')}
              >
                <div className={`h-48 flex items-center justify-center transition-all duration-300 ${
                  activeProduct === 'deploy' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                }`}>
                  <svg viewBox="0 0 120 120" className="w-40 h-40">
                    {/* Central circle with radial lines */}
                    <circle cx="60" cy="60" r="32" fill="none" stroke={activeProduct === 'deploy' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    <circle cx="60" cy="60" r="18" fill="none" stroke={activeProduct === 'deploy' ? '#22c55e' : '#9ca3af'} strokeWidth="1" opacity="0.6"/>
                    
                    {/* Radial lines */}
                    <line x1="60" y1="28" x2="60" y2="15" stroke={activeProduct === 'deploy' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5" opacity="0.7"/>
                    <line x1="84" y1="60" x2="97" y2="60" stroke={activeProduct === 'deploy' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5" opacity="0.7"/>
                    <line x1="60" y1="92" x2="60" y2="105" stroke={activeProduct === 'deploy' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5" opacity="0.7"/>
                    <line x1="36" y1="60" x2="23" y2="60" stroke={activeProduct === 'deploy' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5" opacity="0.7"/>
                    
                    {/* Center plus */}
                    <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill={activeProduct === 'deploy' ? '#22c55e' : '#9ca3af'} fontWeight="300">+</text>
                  </svg>
                </div>
              </div>

              {/* MONITOR Diagram */}
              <div
                className="flex flex-col items-center cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveProduct('monitor')}
              >
                <div className={`h-48 flex items-center justify-center transition-all duration-300 ${
                  activeProduct === 'monitor' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                }`}>
                  <svg viewBox="0 0 120 120" className="w-40 h-40">
                    {/* Multiple circular clusters */}
                    <circle cx="30" cy="30" r="20" fill="none" stroke={activeProduct === 'monitor' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    <circle cx="80" cy="35" r="22" fill="none" stroke={activeProduct === 'monitor' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5" strokeDasharray="4,3"/>
                    <circle cx="55" cy="80" r="24" fill="none" stroke={activeProduct === 'monitor' ? '#22c55e' : '#9ca3af'} strokeWidth="1.5"/>
                    
                    {/* Inner circles */}
                    <circle cx="30" cy="30" r="10" fill="none" stroke={activeProduct === 'monitor' ? '#22c55e' : '#9ca3af'} strokeWidth="1" opacity="0.5"/>
                    <circle cx="80" cy="35" r="12" fill="none" stroke={activeProduct === 'monitor' ? '#22c55e' : '#9ca3af'} strokeWidth="1" opacity="0.5"/>
                    <circle cx="55" cy="80" r="11" fill="none" stroke={activeProduct === 'monitor' ? '#22c55e' : '#9ca3af'} strokeWidth="1" opacity="0.5"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Text Content Row */}
            <div className="grid grid-cols-4 gap-8">
              {/* ITERATE */}
              <div
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveProduct('iterate')}
              >
                <div className={`transition-all duration-300 ${
                  activeProduct === 'iterate' 
                    ? 'opacity-100' 
                    : 'opacity-50'
                }`}>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    1 ITERATE
                  </div>
                  <h3 className={`text-lg font-medium mb-4 transition-colors duration-300 ${
                    activeProduct === 'iterate' 
                      ? 'text-gray-900' 
                      : 'text-gray-600'
                  }`}>
                    Sketch, test and refine
                  </h3>
                  <ul className={`space-y-2 text-sm transition-colors duration-300 ${
                    activeProduct === 'iterate' 
                      ? 'text-gray-700' 
                      : 'text-gray-500'
                  }`}>
                    <li>Editor</li>
                    <li>Playground</li>
                    <li>Datasets</li>
                  </ul>
                </div>
              </div>

              {/* EVALUATE */}
              <div
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveProduct('evaluate')}
              >
                <div className={`transition-all duration-300 ${
                  activeProduct === 'evaluate' 
                    ? 'opacity-100' 
                    : 'opacity-50'
                }`}>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    2 EVALUATE
                  </div>
                  <h3 className={`text-lg font-medium mb-4 transition-colors duration-300 ${
                    activeProduct === 'evaluate' 
                      ? 'text-gray-900' 
                      : 'text-gray-600'
                  }`}>
                    Reflect and measure
                  </h3>
                  <ul className={`space-y-2 text-sm transition-colors duration-300 ${
                    activeProduct === 'evaluate' 
                      ? 'text-gray-700' 
                      : 'text-gray-500'
                  }`}>
                    <li>Evaluations</li>
                    <li>Datasets</li>
                  </ul>
                </div>
              </div>

              {/* DEPLOY */}
              <div
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveProduct('deploy')}
              >
                <div className={`transition-all duration-300 ${
                  activeProduct === 'deploy' 
                    ? 'opacity-100' 
                    : 'opacity-50'
                }`}>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    3 DEPLOY
                  </div>
                  <h3 className={`text-lg font-medium mb-4 transition-colors duration-300 ${
                    activeProduct === 'deploy' 
                      ? 'text-gray-900' 
                      : 'text-gray-600'
                  }`}>
                    From draft to live
                  </h3>
                  <ul className={`space-y-2 text-sm transition-colors duration-300 ${
                    activeProduct === 'deploy' 
                      ? 'text-gray-700' 
                      : 'text-gray-500'
                  }`}>
                    <li>Deployments</li>
                    <li>Analytics</li>
                    <li>Gateway ↗</li>
                  </ul>
                </div>
              </div>

              {/* MONITOR */}
              <div
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveProduct('monitor')}
              >
                <div className={`transition-all duration-300 ${
                  activeProduct === 'monitor' 
                    ? 'opacity-100' 
                    : 'opacity-50'
                }`}>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    4 MONITOR
                  </div>
                  <h3 className={`text-lg font-medium mb-4 transition-colors duration-300 ${
                    activeProduct === 'monitor' 
                      ? 'text-gray-900' 
                      : 'text-gray-600'
                  }`}>
                    Insights in real time
                  </h3>
                  <ul className={`space-y-2 text-sm transition-colors duration-300 ${
                    activeProduct === 'monitor' 
                      ? 'text-gray-700' 
                      : 'text-gray-500'
                  }`}>
                    <li>Logs</li>
                    <li>Analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 left-8 text-gray-500 text-xs">
        https://www.adaline.ai
      </footer>
    </div>
  )
}

export default App

