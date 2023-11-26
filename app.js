"use strict";


const stepsContainer = document.getElementById("stepsContainer");
const notificationToggler = document.getElementById("notificationToggler");
const menuToggler = document.getElementById("menuToggler");
const notificationDialog = document.getElementById("notificationDialog");
const menuDialog = document.getElementById("menuDialog");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const updatesContainer = document.getElementById("updatesContainer");
const updatesContainerCloser = document.getElementById("updatesContainerCloser");

//Notification icon button click event listener
notificationToggler.addEventListener("click", (event)=>{ 
  const expanded = notificationToggler.getAttribute('aria-expanded') === 'true';  
  if (expanded) {
    notificationToggler.setAttribute('aria-expanded', 'false');
    notificationDialog.setAttribute('aria-hidden', 'true');
  } else {
    notificationToggler.setAttribute('aria-expanded', 'true');
    notificationDialog.setAttribute('aria-hidden', 'false');
  }

  // Close Menu Dialog
    menuToggler.setAttribute('aria-expanded', 'false');
    menuDialog.setAttribute('aria-hidden', 'true');
})

// Menu icon click event listener
menuToggler.addEventListener("click", (event)=>{ 
  const expanded = menuToggler.getAttribute('aria-expanded') === 'true';  
  if (expanded) {
    menuToggler.setAttribute('aria-expanded', 'false');
    menuDialog.setAttribute('aria-hidden', 'true');
  } else {
    menuToggler.setAttribute('aria-expanded', 'true');
    menuDialog.setAttribute('aria-hidden', 'false');
  }

  //Close Notification Dialog
  notificationToggler.setAttribute('aria-expanded', 'false');
  notificationDialog.setAttribute('aria-hidden', 'true');
})

updatesContainerCloser.addEventListener("click", (event)=>{
  updatesContainer.setAttribute("aria-hidden", "true")
  updatesContainerCloser.setAttribute("aria-expanded", "false");
})




/**
 * toggleStepContainer is used to toggle steps group display
 * 
 * @param {HTMLButtonElement} btnDom  `this` param passed from target when called 
 */
const toggleStepContainer=(btnDom)=>{
  const expanded = btnDom.getAttribute('aria-expanded') === 'true';
  
  if (expanded) {
    btnDom.setAttribute('aria-expanded', 'false');
    stepsContainer.setAttribute('aria-hidden', 'true');
  } else {
    btnDom.setAttribute('aria-expanded', 'true');
    stepsContainer.setAttribute('aria-hidden', 'false');
  }

  //change caret direction
  btnDom.firstElementChild?.classList?.toggle("rotate-180")
}



/** sectionExpander computes step's hidden details expansion
 * @param {HTMLDivElement} stepSection 
 */
const sectionExpander=(stepSection)=>{
  if(!stepSection) return
  const stepDetailsContainer = stepSection.querySelector(".step-details-collapse")

  const hidden = stepDetailsContainer.getAttribute("aria-hidden") === "true";
   if(!hidden) return;

  // Collapse all details
  const allStepDetailsContainers =  document.querySelectorAll(".step-details-collapse");
  allStepDetailsContainers.forEach(detail=>detail.setAttribute("aria-hidden", "true"))

  // Set arial expanded for all sections to false 
  const allSections = document.querySelectorAll(".step-section")
  allSections.forEach(section=>section.setAttribute("aria-expanded", "false"))

  // Expand the clicked section details
  stepDetailsContainer.setAttribute("aria-hidden", "false")
  stepSection.setAttribute("aria-expanded", "true")
}

/**
 * Computes progress bar indicator based on completed steps
 */
const progressIndicator=()=>{
  const checkedStepsCounter = stepsContainer.querySelectorAll('input[type="checkbox"]:checked')?.length
  progressBar.value = checkedStepsCounter*20;
  progressLabel.innerHTML = checkedStepsCounter;
}

/**
 * expandNextStep checks next unmarked step and expand it
 * @param {HTMLDivElement} curentStep 
 */
const expandNextStep=(curentStep)=>{
  if(!curentStep) return;
  const allSteps = Array.from(curentStep.parentElement.children);

  const stepIndex = allSteps.indexOf(curentStep);
  if(stepIndex == -1) return
  const otherSteps = [... allSteps.slice(stepIndex+1), ...allSteps.slice(0, stepIndex)]
  const nextUncheckedStep = otherSteps.find(step=>{    
    const checkbox = step.querySelector("input[type='checkbox']");
    return checkbox && !checkbox.checked
  })
  if(nextUncheckedStep){
    sectionExpander(nextUncheckedStep)
  }

  // Update steps progress
  progressIndicator()
}

/**
 * checkStepWithLabelFocus helps expand next unmarked step for keyboard users
 * @param {HTMLLabelElement} label 
 */
const checkStepWithLabelFocus=(label)=>{
  const checkbox = label.previousElementSibling
  if (checkbox?.nodeName  !== "INPUT") return
  checkbox.checked = !checkbox.checked
  const currentStep = label.closest(".step-section")
  expandNextStep(currentStep)
}


// Click event listener for step expand
stepsContainer.addEventListener("click", (event)=>{
  const stepSection = event.target.closest(".step-section")
  if(!stepSection) return;
  if(event.target?.nodeName === "INPUT"){
    if(event.target.checked === true){
      return expandNextStep(stepSection);
    }else{
      // Update steps progress
      progressIndicator()
      return; // To enable unchecking without expand, in case stopPropagation fails
    }
  } else if(event.target?.nodeName === "LABEL"){
    return // Neglect click from label, layered with input already
  }
  sectionExpander(stepSection)
})

// Key down event listener for step expand
stepsContainer.addEventListener("keydown", (event)=>{
  if (event.key !== ' ' && event.key !== 'Enter')  return
  const focusedElement = document.activeElement;
  if(focusedElement.nodeName === "LABEL" && event.key === ' '){
    return checkStepWithLabelFocus(focusedElement)
  }
  const stepSection = focusedElement.closest(".step-section")  
  if(!stepSection) return;
  sectionExpander(stepSection)
})
