const VARIANTS = {
  primary:  'bg-[#238636] hover:bg-[#2ea043] text-white border border-[#238636] hover:border-[#2ea043]',
  blue:     'bg-[#1F6FEB] hover:bg-[#388bfd] text-white border border-[#1F6FEB]',
  ghost:    'bg-transparent hover:bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] border border-transparent hover:border-[#30363D]',
  outline:  'bg-transparent hover:bg-[#21262D] text-[#E6EDF3] border border-[#30363D] hover:border-[#3D444D]',
  danger:   'bg-transparent hover:bg-[#F8514920] text-[#F85149] border border-[#F85149] hover:border-[#ff6b6b]',
  subtle:   'bg-[#21262D] hover:bg-[#2D333B] text-[#C9D1D9] border border-transparent',
}

const SIZES = {
  xs: 'h-6  px-2   text-lg  gap-1',
  sm: 'h-7  px-3   text-lg  gap-1.5',
  md: 'h-8  px-3   text-xl  gap-2',
  lg: 'h-9  px-4   text-xl  gap-2',
  xl: 'h-10 px-5   text-2xl gap-2',
}

export default function Button({ variant = 'outline', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-mono rounded-md transition-colors duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
