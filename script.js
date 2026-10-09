/* FrameSpace gallery: filters, favorites, slideshow, random discovery, sharing and lightbox. */
const images = [
 {id:1,title:"Into the Wild",category:"animals",description:"A glimpse into the beauty of the animal kingdom.",tags:["wildlife","animal","outdoors"],src:"https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=85"},
 {id:2,title:"Mountain Escape",category:"nature",description:"Peaceful mountain scenery beneath an open sky.",tags:["mountain","landscape","outdoors"],src:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85"},
 {id:3,title:"Quiet Confidence",category:"portraits",description:"A portrait that captures character and expression.",tags:["person","portrait","expression"],src:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"},
 {id:4,title:"Urban Geometry",category:"architecture",description:"Modern architecture defined by lines and symmetry.",tags:["building","city","design"],src:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85"},
 {id:5,title:"Colour in Motion",category:"abstract",description:"Colour, shape and texture come together.",tags:["colour","texture","art"],src:"https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=85"},
 {id:6,title:"The Gentle Giant",category:"animals",description:"Discover the fascinating world of wildlife.",tags:["wildlife","animal","nature"],src:"https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=85"},
 {id:7,title:"Forest Serenity",category:"nature",description:"A quiet forest filled with natural beauty.",tags:["forest","trees","green"],src:"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85"},
 {id:8,title:"Golden Hour",category:"portraits",description:"Warm natural light brings this portrait to life.",tags:["portrait","golden hour","person"],src:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85"},
 {id:9,title:"City of Dreams",category:"architecture",description:"An architectural view of the modern city.",tags:["city","building","urban"],src:"https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85"},
 {id:10,title:"Ocean Patterns",category:"abstract",description:"A study of fluid shapes and shifting colour.",tags:["ocean","abstract","blue"],src:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85"},
 {id:11,title:"Into the Blue",category:"animals",description:"An intimate look at the natural world.",tags:["wildlife","blue","animal"],src:"https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?auto=format&fit=crop&w=1000&q=85"},
 {id:12,title:"Open Horizons",category:"nature",description:"A wide-open landscape inviting exploration.",tags:["landscape","horizon","sky"],src:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85"},
 {id:13,title:"Natural Expression",category:"portraits",description:"A candid moment captured through the lens.",tags:["portrait","expression","person"],src:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85"},
 {id:14,title:"Concrete Lines",category:"architecture",description:"Minimalist forms and striking structural detail.",tags:["architecture","lines","building"],src:"https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85"},
 {id:15,title:"Abstract Energy",category:"abstract",description:"A vibrant composition of colour and movement.",tags:["abstract","colour","art"],src:"https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=85"}
];

// Add further records to this array to grow the collection to 250 photographs.
const $ = id => document.getElementById(id);
const galleryGrid=$("gallery-grid"),filterList=$("filter-list"),searchInput=$("search-input"),sortSelect=$("sort-select");
const resultsCount=$("results-count"),emptyState=$("empty-state"),lightbox=$("lightbox"),lightboxImage=$("lightbox-image");
const lightboxTitle=$("lightbox-title"),lightboxCategory=$("lightbox-category"),lightboxDescription=$("lightbox-description");
const viewerCounter=$("viewer-counter"),closeButton=$("close-lightbox"),previousButton=$("previous-image"),nextButton=$("next-image");
const downloadButton=$("download-image"),toast=$("toast"),themeToggle=$("theme-toggle"),themeIcon=$("theme-icon"),themeLabel=$("theme-label");
const favoritesFilter=$("favorites-filter"),favoriteCount=$("favorite-count"),randomButton=$("random-button"),slideshowButton=$("slideshow-button");
let activeCategory="all",searchTerm="",sortMode="default",favoritesOnly=false,visibleImages=[],currentImageIndex=0,lastFocusedElement=null,toastTimer=null,slideshowTimer=null,slideshowRunning=false;
let favorites=new Set();
try{favorites=new Set(JSON.parse(localStorage.getItem("framespace-favorites")||"[]"));}catch(e){favorites=new Set();}
$("total-count").textContent=images.length;
$("category-count").textContent=new Set(images.map(i=>i.category)).size;
$("current-year").textContent=new Date().getFullYear();

function persistFavorites(){try{localStorage.setItem("framespace-favorites",JSON.stringify([...favorites]));}catch(e){showToast("Favorites work for this session, but browser storage is unavailable.");}}
function updateFavoriteCount(){favoriteCount.textContent=favorites.size;favoritesFilter.setAttribute("aria-pressed",String(favoritesOnly));favoritesFilter.classList.toggle("active",favoritesOnly);}
function isFavorite(id){return favorites.has(id);}
function getFilteredImages(){
 let list=images.filter(image=>{
  const matchesCategory=activeCategory==="all"||image.category===activeCategory;
  const text=[image.title,image.description,image.category,...(image.tags||[])].join(" ").toLowerCase();
  return matchesCategory&&text.includes(searchTerm)&&(!favoritesOnly||isFavorite(image.id));
 });
 if(sortMode==="az")list.sort((a,b)=>a.title.localeCompare(b.title));
 else if(sortMode==="za")list.sort((a,b)=>b.title.localeCompare(a.title));
 return list;
}
function renderGallery(){
 visibleImages=getFilteredImages();galleryGrid.replaceChildren();galleryGrid.setAttribute("aria-busy","true");
 const fragment=document.createDocumentFragment();
 visibleImages.forEach((image,index)=>{
  const card=document.createElement("article");card.className="gallery-item";card.style.animationDelay=`${Math.min(index*25,220)}ms`;
  const open=document.createElement("button");open.className="image-button";open.type="button";open.dataset.id=image.id;open.setAttribute("aria-label",`Open ${image.title}`);
  const img=document.createElement("img");img.src=image.src;img.alt=image.title;img.loading=index<6?"eager":"lazy";img.decoding="async";
  img.addEventListener("error",()=>{card.classList.add("image-error");img.alt=`${image.title} — image unavailable`;img.style.minHeight="200px";},{once:true});
  const overlay=document.createElement("span");overlay.className="image-overlay";const zoom=document.createElement("span");zoom.className="zoom-label";zoom.textContent="↗ View image";overlay.append(zoom);open.append(img,overlay);
  const info=document.createElement("div");info.className="card-info";const category=document.createElement("span");category.className="card-category";category.textContent=image.category;
  const title=document.createElement("h3");title.textContent=image.title;const description=document.createElement("p");description.textContent=image.description;
  const bottom=document.createElement("div");bottom.className="card-bottom";const number=document.createElement("span");number.textContent=`PHOTO ${String(index+1).padStart(2,"0")}`;
  const tools=document.createElement("div");tools.className="card-tools";const view=document.createElement("span");view.className="card-view";view.textContent="View ↗";
  const fav=document.createElement("button");fav.type="button";fav.className=`favorite-button${isFavorite(image.id)?" is-favorite":""}`;fav.textContent=isFavorite(image.id)?"♥":"♡";fav.setAttribute("aria-label",`${isFavorite(image.id)?"Remove":"Add"} ${image.title} ${isFavorite(image.id)?"from":"to"} favorites`);fav.setAttribute("aria-pressed",String(isFavorite(image.id)));fav.dataset.favoriteId=image.id;
  tools.append(view,fav);bottom.append(number,tools);info.append(category,title,description,bottom);card.append(open,info);fragment.append(card);
 });
 galleryGrid.append(fragment);galleryGrid.setAttribute("aria-busy","false");
 resultsCount.textContent=`Showing ${visibleImages.length} of ${images.length} photographs${favoritesOnly?" · favorites":""}`;
 emptyState.hidden=visibleImages.length!==0;galleryGrid.hidden=visibleImages.length===0;updateFavoriteCount();
}
filterList.addEventListener("click",event=>{const button=event.target.closest("[data-category]");if(!button)return;activeCategory=button.dataset.category;filterList.querySelectorAll(".filter-button").forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));});renderGallery();});
searchInput.addEventListener("input",()=>{searchTerm=searchInput.value.trim().toLowerCase();renderGallery();});
sortSelect.addEventListener("change",()=>{sortMode=sortSelect.value;renderGallery();});
$("reset-button").addEventListener("click",resetFilters);
function resetFilters(){activeCategory="all";searchTerm="";sortMode="default";favoritesOnly=false;searchInput.value="";sortSelect.value="default";filterList.querySelectorAll(".filter-button").forEach(button=>{const active=button.dataset.category==="all";button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});renderGallery();}
favoritesFilter.addEventListener("click",()=>{favoritesOnly=!favoritesOnly;renderGallery();});
galleryGrid.addEventListener("click",event=>{
 const favButton=event.target.closest("[data-favorite-id]");
 if(favButton){toggleFavorite(Number(favButton.dataset.favoriteId));return;}
 const button=event.target.closest(".image-button");if(!button)return;
 const index=visibleImages.findIndex(image=>String(image.id)===button.dataset.id);if(index>=0)openLightbox(index);
});
function toggleFavorite(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);persistFavorites();updateFavoriteCount();renderGallery();if(!lightbox.hidden&&visibleImages[currentImageIndex])updateLightbox();}
function openLightbox(index){if(!visibleImages.length)return;lastFocusedElement=document.activeElement;currentImageIndex=index;updateLightbox();lightbox.hidden=false;lightbox.setAttribute("aria-hidden","false");document.body.classList.add("viewer-open");closeButton.focus();}
function updateLightbox(){
 const image=visibleImages[currentImageIndex];if(!image)return;
 $("viewer-loading").hidden=false;lightboxImage.hidden=true;lightboxImage.src=image.src;lightboxImage.alt=image.title;
 lightboxImage.onload=()=>{$("viewer-loading").hidden=true;lightboxImage.hidden=false;};
 lightboxImage.onerror=()=>{$("viewer-loading").textContent="Image could not load. Check your connection or image URL.";};
 lightboxTitle.textContent=image.title;lightboxCategory.textContent=image.category;lightboxDescription.textContent=image.description;
 viewerCounter.textContent=`${String(currentImageIndex+1).padStart(2,"0")} / ${String(visibleImages.length).padStart(2,"0")}`;
 downloadButton.href=image.src;downloadButton.download=image.title.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".jpg";
 $("viewer-favorite").textContent=isFavorite(image.id)?"♥ Saved":"♡ Save";$("viewer-favorite").setAttribute("aria-pressed",String(isFavorite(image.id)));
 const tags=$("lightbox-tags");tags.replaceChildren();(image.tags||[]).forEach(value=>{const span=document.createElement("span");span.className="tag";span.textContent=value;tags.append(span);});
 previousButton.hidden=nextButton.hidden=visibleImages.length<2;renderRelated(image);
}
function renderRelated(image){
 const holder=$("related-images");holder.replaceChildren();
 const related=images.filter(item=>item.id!==image.id&&(item.category===image.category||(item.tags||[]).some(tag=>(image.tags||[]).includes(tag)))).slice(0,6);
 related.forEach(item=>{const button=document.createElement("button");button.className="related-card";button.type="button";button.innerHTML="";const img=document.createElement("img");img.src=item.src;img.alt="";img.loading="lazy";const label=document.createElement("span");label.textContent=item.title;button.append(img,label);button.addEventListener("click",()=>{const index=visibleImages.findIndex(entry=>entry.id===item.id);if(index>=0){currentImageIndex=index;updateLightbox();}else{showToast("This related image is outside the current filters. Clear filters to open it.");}});holder.append(button);});
 if(!related.length){const note=document.createElement("p");note.textContent="No related photographs yet.";note.className="muted";holder.append(note);}
}
function showNextImage(){if(!visibleImages.length)return;currentImageIndex=(currentImageIndex+1)%visibleImages.length;updateLightbox();}
function showPreviousImage(){if(!visibleImages.length)return;currentImageIndex=(currentImageIndex-1+visibleImages.length)%visibleImages.length;updateLightbox();}
nextButton.addEventListener("click",showNextImage);previousButton.addEventListener("click",showPreviousImage);
function closeLightbox(){if(lightbox.hidden)return;lightbox.hidden=true;lightbox.setAttribute("aria-hidden","true");document.body.classList.remove("viewer-open");lightboxImage.removeAttribute("src");if(lastFocusedElement&&lastFocusedElement.isConnected)lastFocusedElement.focus();}
closeButton.addEventListener("click",closeLightbox);lightbox.addEventListener("click",event=>{if(event.target===lightbox)closeLightbox();});
$("viewer-favorite").addEventListener("click",()=>{const image=visibleImages[currentImageIndex];if(image)toggleFavorite(image.id);});
$("share-image").addEventListener("click",shareCurrentImage);
async function shareCurrentImage(){const image=visibleImages[currentImageIndex];if(!image)return;const shareData={title:image.title,text:image.description,url:image.src};try{if(navigator.share)await navigator.share(shareData);else if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(image.src);showToast("Image link copied to clipboard.");}else{window.prompt("Copy this image URL:",image.src);}}catch(error){if(error.name!=="AbortError")showToast("Sharing was unavailable. You can copy the image URL from the address bar.");}}
downloadButton.addEventListener("click",async event=>{
 const image=visibleImages[currentImageIndex];if(!image)return;event.preventDefault();
 const filename=image.title.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".jpg";
 try{const response=await fetch(image.src);if(!response.ok)throw new Error("Image fetch failed");const blob=await response.blob();const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);showToast("Your download has started.");}
 catch(error){window.open(image.src,"_blank","noopener");showToast("Opened the original image. Save it from the new tab if download is blocked.");}
});
randomButton.addEventListener("click",()=>{
 const pool=getFilteredImages();if(!pool.length){showToast("No photographs match the current filters.");return;}
 let choice=pool[Math.floor(Math.random()*pool.length)];
 if(pool.length>1&&visibleImages[currentImageIndex]?.id===choice.id)choice=pool[(pool.indexOf(choice)+1)%pool.length];
 visibleImages=pool;openLightbox(visibleImages.findIndex(item=>item.id===choice.id));
});
function startSlideshow(){if(!visibleImages.length){showToast("No photographs available for the slideshow.");return;}if(lightbox.hidden)openLightbox(0);slideshowRunning=true;slideshowButton.textContent="Ⅱ Pause slideshow";slideshowButton.setAttribute("aria-pressed","true");clearInterval(slideshowTimer);slideshowTimer=setInterval(()=>{if(!lightbox.hidden)showNextImage();},3500);}
function stopSlideshow(){slideshowRunning=false;clearInterval(slideshowTimer);slideshowTimer=null;slideshowButton.textContent="▶ Start slideshow";slideshowButton.setAttribute("aria-pressed","false");}
slideshowButton.addEventListener("click",()=>slideshowRunning?stopSlideshow():startSlideshow());
document.addEventListener("keydown",event=>{
 if(!lightbox.hidden){
  if(event.key==="Escape"){closeLightbox();stopSlideshow();}
  else if(event.key==="ArrowRight"){event.preventDefault();showNextImage();}
  else if(event.key==="ArrowLeft"){event.preventDefault();showPreviousImage();}
  else if(event.code==="Space"){event.preventDefault();slideshowRunning?stopSlideshow():startSlideshow();}
  return;
 }
 const typing=event.target.matches("input,textarea,select,[contenteditable='true']");
 if(event.key==="/"&&!typing&&!event.ctrlKey&&!event.metaKey&&!event.altKey){event.preventDefault();searchInput.focus();}
});
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),3000);}
const themeMeta=document.querySelector('meta[name="theme-color"]');
function applyTheme(isLight){document.body.classList.toggle("light-mode",isLight);themeIcon.textContent=isLight?"☾":"☀";themeLabel.textContent=isLight?"Night mode":"Day mode";themeToggle.setAttribute("aria-label",isLight?"Switch to night mode":"Switch to day mode");themeToggle.setAttribute("aria-pressed",String(isLight));if(themeMeta)themeMeta.content=isLight?"#f4f7fb":"#0b0e14";}
let savedTheme=null;try{savedTheme=localStorage.getItem("framespace-theme");}catch(e){}
applyTheme(savedTheme==="day");
themeToggle.addEventListener("click",()=>{const isLight=!document.body.classList.contains("light-mode");applyTheme(isLight);try{localStorage.setItem("framespace-theme",isLight?"day":"night");}catch(e){}});
renderGallery();
