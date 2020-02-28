
var bd;

// Tentative d'ouverture de la bd
// Le deuxième paramètre représente le numéro de version
var requete = indexedDB.open("BdProduits", 1);

// Créer ou mettre à jour (si le numéro de version change)
requete.onupgradeneeded = function(event){
    var bd = event.target.result;

    // Création du "store" à l'aide des options
    var options = {
        keyPath: "cle", //nom de la clé primaire
        autoIncrement: true //true si la clé primaire peut être générée
    };
    var produit = bd.createObjectStore("Theproduits", options);

    // Création d'un index, qui permet la recherche
    produit.createIndex("nomIndex", "cle");

    // Ajout de données
    produit.transaction.oncomplete = function(event){
        // Ouverture de la transaction
        var trans = bd.transaction("Theproduits", "readwrite");
        var Theproduits = trans.objectStore("Theproduits");
        console.log(Theproduits);
        // Ajout
        Theproduits.add({
            cle: 1,
            quantite : 60,
            nom : "banane",
            urlImage :"https://cdn.shopify.com/s/files/1/0665/4989/products/banane.png?v=1458596631",
            prix : 60,
            fournisseur : "aucun",
            description : "yoyo cest le produit",
            autre: true
        });
        Theproduits.add({
            quantite : 45,
            nom : "poire",
            urlImage :"https://www.santeenvrac.com/i/Balsamique-de-Poire-1022.jpg",
            prix : 60,
            fournisseur : "aucun",
            description : "yoyo cest le produit",
            autre: true
        });

    };
};

// Gestion des erreurs d'ouverture
requete.onerror = function(event){
    console.log(event.target.errorCode);
};

// En cas de succès, "bd" contient la connexion
requete.onsuccess = function(event){
    bd = event.target.result;
    remplirliste();
};
function remplirliste()
{

        app.produits=[];
        var transaction = bd.transaction(["Theproduits"], "readwrite");
        var Theproduits = transaction.objectStore("Theproduits");
        Theproduits.openCursor().onsuccess = function(event){
            var cursor = event.target.result;
            if(cursor){
                app.produits.push(cursor.value);
                cursor.continue();
            }

        };
    console.log(app.produits);
}

const Liste = { template: WrapList};
const Consulter = { template: WrapProduit };
const Modifier = { template: WrapModif,watch:{$route(to,from){}} };
const Ajouter = { template: WrapAjout };



const routes = [
    { path: '/', component: Liste, },
    { path: '/produits/:produitId', component: Consulter },
    { path: '/produits/:produitId/edition', component: Modifier },
    { path: '/produit/ajout', component: Ajouter }
];



const router = new VueRouter({
    routes

});

const app = new Vue({
    router,

    data:{
        produits:[]
    },
    methods:{
        GotoModif: function (id) {
            router.push('/produits/'+id+'/edition');
            // Exemple Obtenir
            console.log(this.$route.params.produitId);
            var int=parseInt(this.$route.params.produitId);
            console.log(int);
            var transaction = bd.transaction(["Theproduits"], "readwrite");
            var Theproduits = transaction.objectStore("Theproduits");
            var requete = Theproduits.get(id);
            requete.onsuccess = function(event){
                console.log(event.target.result.nom);
                $("#modifId").val(event.target.result.cle);
                $("#modifQuantite").val(event.target.result.quantite);
                $("#modifNom").val(event.target.result.nom);
                $("#imgModif").attr('src',event.target.result.urlImage);
                $("#modifPrix").val(event.target.result.prix);
                $("#modifFournisseur").val(event.target.result.fournisseur);
                $("#modifDescription").val(event.target.result.description);
            };

        },
        GotoConsulter: function(id){
            router.push('/produits/'+id);
            // Exemple Obtenir
            var transaction = bd.transaction(["Theproduits"], "readwrite");
            var Theproduits = transaction.objectStore("Theproduits");
            var requete = Theproduits.get(id);
            requete.onsuccess = function(event){
                console.log(event.target.result.quantite);
                $("#ajoutId").val(event.target.result.cle);
                $("#qteProduit").text(event.target.result.quantite);
                $("#nomProduit").text(event.target.result.nom);
                $("#imgW").attr('src',event.target.result.urlImage);
                $("#prixProduit").text(event.target.result.prix);
                $("#fournisseurProduit").text(event.target.result.fournisseur);
                $("#descProduit").text(event.target.result.description);
            };
        }
    }
}).$mount('#app');

//function
function GotoModif(id)
{
}




function changerImg(){
        $("#btnImg").change(function () {
            readURL(this);
        });



    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                //alert(e.target.result);
                $('#imgLogo').attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
}

function GoToModifFromCons()
{
    var id=parseInt($("#ajoutId").val());

    router.push('/produits/'+id+'/edition');
    // Exemple Obtenir
    var transaction = bd.transaction(["Theproduits"], "readwrite");
    var Theproduits = transaction.objectStore("Theproduits");
    var requete = Theproduits.get(id);
    requete.onsuccess = function(event){
        console.log(event.target.result.nom+"yoyooyoyoyoyoyooy");
        $("#modifId").val(event.target.result.cle);
        $("#modifQuantite").val(event.target.result.quantite);
        $("#modifNom").val(event.target.result.nom);
        $("#imgModif").attr('src',event.target.result.urlImage);
        $("#modifPrix").val(event.target.result.prix);
        $("#modifFournisseur").val(event.target.result.fournisseur);
        $("#modifDescription").val(event.target.result.description);
    };
    requete.onerror= function(event){
        alert("cet item n'Existe pas");
        router.push("/");
    }
}

function ajouterProduit()
{var ok=true;
    var reg = /(\d+\.\d{1,2})|^[0-9]*$/;

    if(!$("#ajoutPrix").val().match(reg)){
        ok=false;
        alert("entrez un prix valide");
    }
    if(!$("#ajoutQauntite").val().match(reg)){
        ok=false;
        alert("entrez une quantité valide");
    }
    var regName = /^[a-zA-Z,.!? ]*$/;
    if(!$("#ajoutNom").val().match(regName)){
        alert("nom ivalide");
        ok=false;
    }
    if(!$("#ajoutFournisseur").val().match(regName)){
        alert("Fournisseur ivalide");
        ok=false;
    }

    if($("#imgT").val()==="")
    {
        alert("veuillez ajouter une image");
        ok=false;
    }
    if(ok===true){
        router.push("/");
            var transaction = bd.transaction(["Theproduits"], "readwrite");
            var TheProduits = transaction.objectStore("Theproduits");
            TheProduits.add({
                quantite : $("#ajoutQuantite").val(),
                nom : $("#ajoutNom").val(),
                urlImage :$("#imgT").val(),
                prix : $("#ajoutPrix").val(),
                fournisseur : $("#ajoutFournisseur").val(),
                description : $("#ajoutDescription").val(),
                autre: true
            });
            remplirliste();
    }
}
function modifierProduit()
{var ok=true;
    var reg = /(\d+\.\d{1,2})|^[0-9]*$/;

    if(!$("#modifPrix").val().match(reg)){
        ok=false;
        alert("entrez un prix valide");
    }
    if(!$("#modifQuantite").val().match(reg)){
        ok=false;
        alert("entrez une quantité valide");
    }
    var regName = /^[a-zA-Z,.!? ]*$/;
    if(!$("#modifNom").val().match(regName)){
        alert("nom ivalide");
        ok=false;
    }
    if(!$("#modifFournisseur").val().match(regName)){
        alert("Fournisseur ivalide");
        ok=false;
    }
    if($("#btnImg").val()===""){
        $("#btnImg").val($("#imgModif").attr('src'));
    }
    if(ok===true){

        var clet=parseInt($("#modifId").val());
        router.push("/");
            var transaction = bd.transaction(["Theproduits"], "readwrite");
            var Theproduits = transaction.objectStore("Theproduits");
            Theproduits.put({
                cle : clet,
                quantite : $("#modifQuantite").val(),
                nom : $("#modifNom").val(),
                urlImage :$("#btnImg").val(),
                prix : $("#modifPrix").val(),
                fournisseur : $("#modifFournisseur").val(),
                description : $("#modifDescription").val(),
                autre: true
            });
            remplirliste();
    }
}
function modifImage(){
    $("#imgA").attr('src',$("#imgT").val());
}
function ajoutimg(){
    $("#imgModif").attr('src',$("#btnImg").val());
}

function loadImg(url){
    return url;}

    function goHome()
    {
        router.push("/");
    }

function goAjouter()
{
    router.push("/produit/ajout");
}