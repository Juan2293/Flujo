 var cy
$(function(){

    cy = window.cy = cytoscape({
      container: document.getElementById('cy'), 

      style: [ // the stylesheet for the graph
        {
          selector: 'node[estado="terminado"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#D4D5D5',
            'label': 'data(name)',
            'width': 200,
            'height': 200,
            'border-color': '#000',
            'border-width': 5,
            'border-opacity': 0.5,
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'text-max-width':180,
            'font-size': 20
          }
        },
        { selector: 'node[estado="actual"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#2980b9',
            'label': 'data(name)',
            'width': 200,
            'height': 200,
            'border-color': '#000',
            'border-width': 5,
            'border-opacity': 0.5,
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'text-max-width':180,
            'color': '#fff',
            'font-size': 20
          }
        },
       
        { selector: 'node[estado="falta"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#fff ',
            'label': 'data(name)',
            'width': 200,
            'height': 200,
            'border-color': '#000',
            'border-width': 5,
            'border-opacity': 0.5,
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'text-max-width':180,
            'font-size': 20
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 8,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        },
        {
        selector: '.highlighted',
        style: {
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '1s'
        }
        }
      ]
  
  });
  addNodes();

  
});

function addNodes(){

  $.getJSON( "js/data.json", function( data ) {

    var poppers = [];
    poppers = new Array(data.length);

    var x=0; //distancia entre cuadros
    for (let i = 0; i < data.length; i++) {
      x=x+300; //distancia entre cuadros
      cy.add([
        { group: 'nodes', data: { id: data[i].id, name: data[i].name, estado: data[i].estado },
        position: { x: x, y: 150 } }
  ]);

   var b = null;
   var b = cy.elements()[i];
     poppers[i] =   b.popper({
       content: function(){ return makeDiv(data[i].estado); }
    });
     var updatePopper = function(){
      poppers[i].scheduleUpdate();
     };
    b.on('position', updatePopper);
    cy.on('pan zoom resize', updatePopper );
    }

    addEdges();
    
    ajustar();

  });
  
  cy.panzoom({});
  cy.userZoomingEnabled( false )

}

function addEdges(){

  $.getJSON( "js/data.json", function( data ) {

    for (let k = 0; k< data.length-1; k++) {
      cy.add([
        { group: 'edges', data: { id: k+"ad", source: data[k].id, target: data[k+1].id, estado: data[k].estado  } }
  ]);
    } 
    // efecto edges
    var edges = cy.edges('[estado="terminado"]');
    console.log(edges)
    highlightNextEle(edges)

    
  });
  
}
var indexHighlight;
function highlightNextEle(edges) {
   var i=0;
   edges.forEach(element => {
    (function() {
      setTimeout(function(){
        element.addClass('highlighted');
      }, 500 + (600 * i));
      })(i);
     i=i+1;
   });

}

var makeDiv = function(text){
  var div = document.createElement('div');
  div.classList.add('popper-div');
  div.innerHTML = text;
  document.body.appendChild( div );
  return div;
};

 function ajustar() {
  cy.fit(cy.nodes(), 50);
 };