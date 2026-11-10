function toggleMobileNav(){document.getElementById('mobileMenu').classList.toggle('open')}
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const can = document.querySelector('.can-wrap');

// Page-load moment: can drops in, headline lines rise
if(!reduce){
  gsap.from(can,{yPercent:-160,rotation:-25,opacity:0,duration:1.3,ease:'bounce.out'});
  gsap.from('.hero h1 .line',{yPercent:110,duration:1,stagger:.15,ease:'power4.out',delay:.2});
}

// Scroll journey: centre -> left of text -> right of timeline -> spin to rest
const mm = gsap.matchMedia();
mm.add({wide:'(min-width: 821px)',narrow:'(max-width: 820px)'},ctx=>{
  if(reduce) return;
  const wide = ctx.conditions.wide;
  const tl = gsap.timeline({
    scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:1}
  });
  tl.to(can,{rotation:-14,scale:.92,duration:1,ease:'none'})                // hero -> intro (stays centred in the gap)
    .to(can,{rotation:10,scale:.9,y:wide?0:'18vh',duration:1,ease:'none'})   // intro -> story
    .to(can,{x:wide?'-30vw':0,rotation:180,scale:wide?1:.8,y:wide?0:'-8vh',duration:1,ease:'none'}); // story: flips upside down
  // keep the can above the stage on mobile text
});
