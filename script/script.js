// নির্দিষ্ট সেকশন দেখানোর জন্য ফাংশন
function showSection(sectionId) {
    // সব সেকশন হাইড করা হচ্ছে
    document.getElementById("start-section").style.display = "none";
    document.getElementById("vocabulary-section-2").style.display = "none";
    document.getElementById("vocabulary-section-3").style.display = "none";

    // যেটা দেখাতে চাচ্ছি সেটি দেখানো হচ্ছে
    document.getElementById(sectionId).style.display = "block";
}

// সক্রিয় ক্লাসগুলো (active) মুছে ফেলার ফাংশন
function removeActiveClass() {
    const activeButtons = document.getElementsByClassName("active");

    for (let btn of activeButtons) {
        btn.classList.remove("active");
    }
}
function handleLogout(){

    location.reload();
}

// API থেকে সব ক্যাটাগরি লোড করার ফাংশন
function loadCategories() {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(data => {
            displayCategories(data.data); // ক্যাটাগরি ডিসপ্লে করা হচ্ছে
        });
}


const modalLoad = (url)=>{
    fetch(`https://openapi.programming-hero.com/api/word/${url}`)
    .then(res=>res.json())
    .then(data=>{

         const detailsContainer = document.getElementById("details-container");

detailsContainer.innerHTML = `
    <!-- ডাইনামিক মডাল ডিজাইন -->
    <div class="card">
        <figure></figure>
        <div class="card-body">
            <!-- শব্দ ও উচ্চারণ -->
            <h2 class="card-title text-2xl">
                ${data.data.word}
                <span class="text-base text-gray-400 flex items-center ml-2">
                    (<img class="w-4 h-4 inline-block mr-1" src="./assets/microphone.png" alt="">${data.data.pronunciation})
                </span>
                </h2>

            <p class="py-2"><strong>Meaning:</strong><br>${data.data.meaning ? data.data.meaning:"অর্থ পাওয়া যায়নি"}</p>

            <!-- উদাহরণ বাক্য -->
            <p class="py-2"><strong>Example:</strong><br>${data.data.sentence}</p>

            <!-- সমার্থক শব্দ -->
            <p class="py-4">
                <strong>সমার্থক শব্দ:</strong><br>
                ${data.data.synonyms.map(syn => `<button class="btn btn-sm m-1">${syn}</button>`).join("")}
            </p>

            <!-- Complete Learning Button -->
            <div class="pt-4">
                <button onclick="closeModal()" class="btn btn-primary">Complete Learning</button>
            </div>
        </div>
    </div>
`;

        document.getElementById("cart_details").showModal()

    })

}
function closeModal() {
    document.getElementById("cart_details").close();
}
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // Use US English for pronunciation
    window.speechSynthesis.speak(utterance);
}


// নির্দিষ্ট ক্যাটাগরির ভোকাবুলারির ডিটেইলস লোড করার ফাংশন
const loadCategoryWordDetails = (id) => {
    showSection("vocabulary-section-2"); // ভোকাবুলারি সেকশন দেখানো হচ্ছে

    // Spinner show
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("hidden");

    // পূর্বের স্টার্ট সেকশনের কনটেন্ট ক্লিয়ার করা হচ্ছে
    const noneSelectContorl = document.getElementById("start-section");
    noneSelectContorl.innerHTML = "";

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiveClass(); // আগের active class রিমুভ
            const clickedItem = document.getElementById(`btn-10${id}`);
            clickedItem.classList.add("active"); // ক্লিককৃত বাটনে active ক্লাস যোগ
            displayWord(data.data); // ভোকাবুলারি প্রদর্শন
        })
        .finally(() => {
            spinner.classList.add("hidden"); // Spinner hide
        });
};


// ভোকাবুলারি শব্দগুলো দেখানোর ফাংশন
const displayWord = (carts) => {
    const videoContainer = document.getElementById("cart-container");
    const cartError = document.getElementById("cart-error");

    // পূর্বের কনটেন্ট ক্লিয়ার করা হচ্ছে
    videoContainer.innerHTML = "";
    cartError.innerHTML = "";

    // যদি কোনো ভোকাবুলারি না থাকে
    if (carts.length === 0) {
        showSection("vocabulary-section-3"); // এরর সেকশন দেখানো হচ্ছে

        const videoCard = document.createElement("div");
        videoCard.innerHTML = `
            <div class="flex flex-col items-center text-center gap-4 py-6 px-4">
                <img src="./assets/alert-error.png" alt="" class="mx-auto">
                <p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="text-3xl font-bold">নেক্সট Lesson এ যান।</h1>
            </div>
        `;
        cartError.appendChild(videoCard);
        return;
    }

    showSection("vocabulary-section-2"); // ভোকাবুলারি কার্ড সেকশন দেখানো হচ্ছে

    // গ্রীড লেআউট এপ্লাই করা হচ্ছে
    videoContainer.className = "w-11/12 m-auto grid grid-cols-3 gap-4";

    // প্রতিটি ভোকাবুলারি কার্ড তৈরি
    carts.forEach(cart => {
        const videoCard = document.createElement("div");
        videoCard.innerHTML = `
            <div class="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800">${cart.word}</h2>
                    <p class="text-sm text-gray-500 mt-1">Meaning / Pronunciation</p>
                    <p class="mt-2 text-lg text-gray-500 font-medium">"${cart.meaning ?cart.meaning:"অর্থ নেই"} / ${cart.pronunciation}"</p>
                </div>
                <div class="mt-4 flex space-x-3 justify-between">
                    <button id="btn-${cart.level}" onclick="modalLoad(${cart.id})"  class="p-2 bg-blue-100 rounded-[20%] cursor-pointer">
                        <img src="./assets/info.png" alt="Play" class="w-5 h-5" />
                    </button>
                    <button  class="p-2 bg-blue-100 rounded-[20%] cursor-pointer">
                        <img src="./assets/volume.png" alt="Play" class="w-5 h-5" />
                    </button>
                </div>
            </div>
        `;
     
        videoContainer.appendChild(videoCard);
    });
};

// সব ক্যাটাগরি দেখানোর ফাংশন
function displayCategories(categories) {
    const categoryContainer = document.getElementById("category-container");

    categories.forEach(cat => {
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `
            <button id="btn-${cat.id}" onclick="loadCategoryWordDetails(${cat.level_no})" class="btn btn-outline btn-primary">
                <img class="w-4 h-4" src="./assets/open-book.png" alt="">
                Lesson -${cat.level_no}
            </button>
        `;
        categoryContainer.append(categoryDiv);
    });
}

// পেজ লোড হলে স্টার্ট সেকশন দেখানো হচ্ছে
window.onload = () => {
    showSection("start-section");
};

// ক্যাটাগরি লোড করা হচ্ছে
loadCategories();
