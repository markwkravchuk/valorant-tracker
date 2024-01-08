export class UserInterface {

  createMatchElements(matches, matchElementBuilder, matchHistoryContainer) {
    matchHistoryContainer.innerHTML = '';
    matches.forEach(match => {
      const matchWrapper = matchElementBuilder.createMatchElement(match);
      matchHistoryContainer.appendChild(matchWrapper);
    });
  }

  updateElementContent(elementID, data) {
    const element = document.getElementById(elementID);
    if (element) {
      element.textContent = data;
    }
  }

}