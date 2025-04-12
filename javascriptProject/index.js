document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search");
    const usernameInput = document.getElementById("user_input");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easylabel = document.getElementById("easy-label");
    const mediumlabel = document.getElementById("medium-label");
    const hardlabel = document.getElementById("hard-label");
    const statcardcontainer =document.querySelector(".stat-card");

    searchButton.addEventListener('click', function () {
        const user = usernameInput.value.trim();
        console.log("logging username: ", user);

        const isValid = validusername(user);
        if (!isValid) return;

        fetchUserDetails(user);
    });

    function validusername(username) {
        if (username === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/;
        const ismatching = regex.test(username);

        if (!ismatching) {
            alert("Invalid Username");
        }

        return ismatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            let res = await fetch(url);
            if (!res.ok) {
                throw new Error("Unable to fetch user details");
            }

            const data = await res.json();
            console.log("Login data: ", data);
            displayuserdata(data);

        } catch (error) {
            console.error("Error:", error.message);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateprogress(solved, total, label, circle) {
        const progressdeg = total === 0 ? 0 : (solved / total) * 100;
        console.log(`Progress: ${progressdeg}%`);
        circle.style.setProperty("--progress-degree", `${progressdeg}%`);
        label.textContent = `${solved}/${total}`;
      }

    function displayuserdata(data) {
        const totalEasy = data.totalEasy;
        const totalMedium = data.totalMedium;
        const totalHard = data.totalHard;

        updateprogress(data.easySolved, totalEasy, easylabel, easyProgressCircle);
        updateprogress(data.mediumSolved, totalMedium, mediumlabel, mediumProgressCircle);
        updateprogress(data.hardSolved, totalHard, hardlabel, hardProgressCircle);
        const card = [
            {
              label: "Acceptance Rate",
              value: data.acceptanceRate
            },
            {
              label: "Ranking",
              value: data.ranking
            },
            {
              label: "Contribution",
              value: data.contributionPoints
            },
          ];
        
          console.log("card data", card);

          statcardcontainer.innerHTML=card.map(
            data=>{
                return `
                <div class="card">
                <h3>${data.label}</h3>
                <P>${data.value}</P>

                </div>
                `
            }
          )
    }
    
      
});
