import streamlit as st
import qrcode
import time
import pandas as pd
from PIL import Image

# --- CONFIGURATION DE LA PAGE ---
st.set_page_config(
    page_title="OliPack Dashboard",
    page_icon="🌿",
    layout="wide"
)

# --- STYLE CSS (Pour un look "Dark Mode" Cinématographique) ---
st.markdown("""
<style>
    .stProgress > div > div > div > div {
        background-color: #4CAF50;
    }
    .big-font {
        font-size:30px !important;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

# --- SIDEBAR (Barre latérale de contrôle) ---
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/2920/2920349.png", width=100)
st.sidebar.title("Centre de Contrôle")
st.sidebar.markdown("---")

# Simulation des choix
region = st.sidebar.selectbox(
    "📍 Choisir l'Huilerie (IoT)",
    ("Beni Mellal - Zone A", "Meknès - Agropole", "Marrakech - Oliveraie Sud")
)

# Curseur pour simuler le capteur (L'utilisateur peut jouer avec)
niveau_actuel = st.sidebar.slider("💧 Niveau de la cuve (Simulation)", 0, 100, 75)

st.sidebar.markdown("---")
st.sidebar.info("Système v1.0 connecté")

# --- CORPS PRINCIPAL ---
st.title("🌿 OliPack Manager")
st.markdown(f"**Site connecté :** {region}")

# Création de 3 colonnes pour les KPIs (Indicateurs clés)
col1, col2, col3 = st.columns(3)

with col1:
    st.metric(label="Température Cuve", value="24 °C", delta="-1.2 °C")

with col2:
    st.metric(label="Qualité Margines (pH)", value="4.5", delta="Stable")

with col3:
    # Changement de couleur selon l'urgence
    status = "NORMAL"
    if niveau_actuel > 80:
        status = "CRITIQUE 🔴"
    else:
        status = "OPTIMAL 🟢"
    st.metric(label="Statut Opérationnel", value=status)

# Visualisation du niveau de la cuve
st.markdown("### Niveau de remplissage")
barre = st.progress(0)
for i in range(niveau_actuel):
    time.sleep(0.01) # Petit effet d'animation au chargement
    barre.progress(i + 1)

st.caption(f"Capteur IoT : {niveau_actuel}% de capacité utilisée")

st.markdown("---")

# --- LA LOGIQUE INTELLIGENTE ---
col_action, col_resultat = st.columns([1, 2])

with col_action:
    st.subheader("Action Requise")
    if niveau_actuel > 80:
        st.error("⚠️ NIVEAU CRITIQUE DÉTECTÉ")
        st.write("La cuve est presque pleine. Lancer la procédure de collecte ?")
        
        if st.button("🚛 LANCER LA COLLECTE & TRANSFORMATION", type="primary"):
            with st.spinner('Connexion au camion autonome...'):
                time.sleep(1.5)
            with st.spinner('Optimisation du trajet...'):
                time.sleep(1)
            with st.spinner('Génération du certificat Blockchain...'):
                time.sleep(1)
            
            st.success("✅ Collecte planifiée ! Camion en route.")
            st.session_state['generated'] = True
    else:
        st.success("✅ Tout est sous contrôle.")
        st.write("Pas d'action nécessaire pour le moment.")
        st.session_state['generated'] = False

# --- AFFICHAGE DU RÉSULTAT (QR CODE) ---
with col_resultat:
    if 'generated' in st.session_state and st.session_state['generated']:
        st.subheader("📦 Passeport Numérique (Produit Fini)")
        
        # Données du passeport
        data_passeport = f"OLIPACK ID: {int(time.time())}\nLieu: {region}\nVol: {niveau_actuel}00L\nCarbone: -50kg"
        
        # Génération QR
        qr = qrcode.make(data_passeport)
        qr.save("temp_qr.png")
        
        c1, c2 = st.columns(2)
        with c1:
            st.image("temp_qr.png", width=200, caption="Scannez pour la traçabilité")
        with c2:
            st.success("Transformation validée")
            st.json({
                "ID_Lot": "BATCH-2025-A",
                "Source": region,
                "Volume_Traité": f"{niveau_actuel * 10} Litres",
                "Destination": "Usine Bioplastique",
                "Empreinte_Carbone": "Négative"
            })

#& C:/Users/pc/AppData/Local/Programs/Python/Python311/python.exe -m streamlit run c:/Users/pc/Desktop/app.py