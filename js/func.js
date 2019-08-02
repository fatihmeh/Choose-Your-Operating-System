var userlang = "tr";

// Json dosyasını istiyoruz
var request = new XMLHttpRequest();
request.open("GET","js/lang/"+userlang+".json");
request.responseType = 'json';
request.send();

// Sonucu alıyoruz ve ekrana göstermek için fonksiyona yolluyoruz
request.onload = function()
{
   var jsonRespond = request.response;
   let firstQuestion = 0; // Başlangıç sorusu
   let questionCount = 0; // Soru sayacı
   // Dil değişkenleri testi ##### Bunlar fonksiyona çevrilmeli #####
   console.log( Object.keys(jsonRespond.interface).length );
   document.querySelector(".pri-header h1").textContent = jsonRespond.interface.title;
   document.querySelector(".pri-header h2").textContent = jsonRespond.interface.subtitle;
   document.querySelector(".pri-header p").textContent = jsonRespond.interface.description;
   document.querySelector(".pri-footer").textContent = jsonRespond.interface.lang + jsonRespond.interface.activelang;
   
   createQuestions(jsonRespond,firstQuestion);

   // jsonObj .json dosyasını temsil ediyor
   function createQuestions(jsonObj,qID)
   {

      /*
      ###### question()
      ###### Soruları veya questionLength değişkeni aracılığıyla soru sayısını döndürür
      ###### param0: soru
      */
      let question = function(queryID)
      {
         if (queryID !== undefined )
         {
            return jsonObj.questions.find( function(item) { return item.id === queryID } );
         }
         else
         {
            return jsonObj.questions;
         }
      };
      
      let questionLength = Object.keys(question()).length;

      /* 
      ###### answer()
      ###### Belirtilen sorunun tüm cevaplarını veya tek bir cevaba ait anahtarları döndürür
      ###### param0: soru
      ###### param1: cevap
      */
      let answer = function(question,answer)
      {
         if (answer !== undefined )
         {
            return question.a[answer]
         }
         else
         {
            return question.a
         }
      };

      /* 
      ###### answerLength()
      ###### Belirtilen sorunun cevap sayısını döndürür
      ###### param0: soru
      */
      let answerLength = function() {
         return Object.keys( answer( question(arguments[0]) ) ).length
      }
         
      // ### İleride newElement() fonksiyonu ile değiştirilecek ###
      questionCount += 1;
      let elemQuestion = document.createElement("ul");
      elemQuestion.setAttribute("data-question", qID);
      elemQuestion.innerHTML = "<b style='color:red'>" + questionCount + "</b> " + question(qID).q + "<br><br>";  
      document.querySelector("main").appendChild(elemQuestion);

      // Soruya ait cevapların adetini hesaplar ve elementleri oluşturur
      for (let answerCount = 0; answerCount < answerLength(qID) ; answerCount++)
      {
         // ### İleride newElement() fonksiyonu ile değiştirilecek ###
         var elemAnswer = document.createElement("li");
         elemAnswer.setAttribute("data-answer", answerCount);
         elemAnswer.innerHTML = "<b style='color:green'>" + answerCount + "</b> " + answer(question(qID),answerCount).t;
         questionOrResult(answer(question(qID),answerCount));   
         document.querySelector("ul:last-child").appendChild(elemAnswer);
      }

      // Seçeneği başka bir soru veya sonuç olarak ayarlar
      function questionOrResult()
      {
         if ( arguments[0].hasOwnProperty("to") )
         {
            elemAnswer.setAttribute("data-go", arguments[0].to);
         }
         else
         {
            let dataStop = "";
            for (let resultCount = 0; resultCount < arguments[0].r.length; resultCount++)
            {
               dataStop += arguments[0].r[resultCount] + " ";
            }
            elemAnswer.setAttribute("data-stop", dataStop.split(" ",arguments[0].r.length));
         }
      }

      // Seçeneklere tıklama olayını yakalar
      let answerbutton = document.querySelectorAll("[data-answer]");
      for (let i = 0; i < answerbutton.length; i++)
      {
         answerbutton[i].addEventListener("click", function(){
            let e = document.querySelector("[data-question]");
            if (answerbutton[i].hasAttribute("data-go")) {
               e.remove(e[0]);
               createQuestions(jsonRespond,Number( answerbutton[i].getAttribute("data-go") ));
            }
            else if (answerbutton[i].hasAttribute("data-stop")) {
               e.remove(e[0]);
               createResults(answerbutton[i].getAttribute("data-stop"));
            }
            else {
               alert("Geçerli bir seçenek değil!")
            }
         });
      }

      // Sonuçları getirir
      function createResults() {
         let e = document.querySelector("main");
         let rID = arguments[0].split(",");
         for (let i = 0; i < rID.length; i++) {
            let result = jsonObj.results.find( function(item) { return item.id == rID[i] } );  
            e.innerHTML += rID[i] + "-" + result.s +"<br>";
         }
         //let elemResult = document.createElement("ul");
         //elemResults.setAttribute("data-result",)
      }

   } //function createQuestions(jsonObj)
}
/* 
###### newElement() ###### UYARI: BU FONKSİYON HENÜZ TAMAMLANMADI
###### Verilen özelliklerde element oluşturur
###### param0: Element tipi
###### param1: Elemente eklenecek HTML öğeleri
###### param2: Yeni element hangi elementin içinde oluşturulacak?
###### param3: Element özelliği
###### param4: Özelliğin değeri
*/
function newElement()
{
   if (arguments[0] && arguments[1] !== undefined)
   {
      let newElem = document.createElement(arguments[0]);
      if (arguments[3] && arguments[4] !== undefined) {newElem.setAttribute(arguments[3],arguments[4]);}
      else {}

      newElem.innerHTML = arguments[1];
      document.querySelector(arguments[2]).appendChild(newElem);
   }
   else {console.log("Element oluşturulamadı!")}
}