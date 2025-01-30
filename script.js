document.getElementById("connectWallet").addEventListener("click", async () => {
    if (window.arweaveWallet) {
        try {
            await window.arweaveWallet.connect(["ACCESS_ADDRESS", "ACCESS_BALANCE", "ACCESS_PUBLIC_KEY"]);
            const address = await window.arweaveWallet.getActiveAddress();

            // Fetch Balance
            const balance = await fetch(`https://arweave.net/wallet/${address}/balance`)
                .then(res => res.text())
                .then(data => (parseFloat(data) / 1e12).toFixed(4));

            // Fetch Avatar & arNS Name
            const profileData = await fetch(`https://arweave.net/graphql`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `{ transactions(owners: ["${address}"], tags: [{name: "Arweave-ID"}]) { edges { node { id } } } }`
                })
            }).then(res => res.json());

            const avatarUrl = profileData.data.transactions.edges.length
                ? `https://arweave.net/${profileData.data.transactions.edges[0].node.id}`
                : "https://via.placeholder.com/80";

            // Update UI
            document.getElementById("walletAddress").textContent = address;
            document.getElementById("walletBalance").textContent = balance;
            document.getElementById("walletAvatar").src = avatarUrl;
            document.getElementById("walletAvatar").classList.remove("hidden");
            document.getElementById("walletInfo").classList.remove("hidden");

        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("ArConnect Wallet tidak ditemukan. Silakan instal ekstensi ArConnect.");
    }
});
