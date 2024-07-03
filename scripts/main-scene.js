var MainScene = pc.createScript('Main-Scene-Script');

var phrasesLow = [
    "You better be\n careful today",
    "Don't stand under\n any ladders",
    "Did you look in\n a cracked mirror?",
    "Ouch, unlucky..."
];
var phrasesMid = [
    "You should be ok",
    "Just a normal\n day today",
    "Not lottery luck...",
    "Not bad!",
];
var phrasesHigh = [
    "Walking on\n sunshine!",
    "Nothing bad\n will happen!",
    "Show-off...",
    "Don't see that\n every day",
];

MainScene.attributes.add('speed', { 
    type: 'number', default: 10 
});

MainScene.prototype.initialize = function() {

    const bolt = assets.bolt.resource.instantiateRenderEntity({});
    app.root.addChild(bolt);
    
    var shaderDefinition = {
        attributes: {
            vVertex: pc.SEMANTIC_POSITION,
            vNormal: pc.SEMANTIC_NORMAL,
            vTexCoord: pc.SEMANTIC_TEXCOORD0
        },
        vshader: assets.vs.resource,
        fshader: assets.fs.resource
    };
    
    var newShader = new pc.Shader(device, shaderDefinition);
    bolt.render.meshInstances[0].material = new pc.Material();
    bolt.render.meshInstances[0].material.blendType = pc.BLEND_NORMAL;
    bolt.render.meshInstances[0].material.shader = newShader;
    
    bolt.render.meshInstances[0].material.setParameter('uTime', 0);
    bolt.render.meshInstances[0].material.setParameter('uDiffuseMap', assets.boltMatCap.resource);

    const topText = new pc.Entity('toptext');
    topText.addComponent('element', {
        pivot: new pc.Vec2(0.5, 0.5),
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        type: pc.ELEMENTTYPE_TEXT,
        font: assets.bpFont.resource,
        fontSize: 140,
        text: "",
        // color: [0.1,0.1,0.1],
        color: [1,1,1],
        alignment: [0.5,0.5],
    });
    uiGroup.addChild(topText);
    topText.setLocalPosition(0,-20,0);

    const bottomText = new pc.Entity('toptext');
    bottomText.addComponent('element', {
        pivot: new pc.Vec2(0.5, 0.5),
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        type: pc.ELEMENTTYPE_TEXT,
        font: assets.bpFont.resource,
        fontSize: 72,
        text: "Tap to Reveal\n Your Luck",
        // color: [0.1,0.1,0.1],
        color: [0.1019, 0.3254, 0.0980],
        alignment: [0.5,0.5],
    });
    uiGroup.addChild(bottomText);
    bottomText.setLocalPosition(0,-350,0);


    const light = new pc.Entity('light');
    light.addComponent('light');
    app.root.addChild(light);
    light.setEulerAngles(45, 0, 0);

    bolt.setLocalScale(2,2,2);
    bolt.setLocalEulerAngles(90,-20,0);
    bolt.setLocalPosition(0, 0.14, 0);
    
    // app.on('update', dt => bolt.rotate(10 * dt, 20 * dt, 10 * dt));
    var time = 0;
    var currentScale = 0.5;
    // var needsToShrink = false;
    app.on('update', dt => {
        time += dt;
        var mod = Math.sin(time);
        bolt.rotate(0,20 * mod * dt,0);
        
        currentScale = lerp1(currentScale, 2, dt * 7);
        bolt.setLocalScale(currentScale,currentScale,currentScale);
    });

    
    function resetLuck() {
        let l = Math.floor(Math.random() * 100) + 1;
        topText.element.text = l.toString() + '%';
        currentScale = 3;
        if(l < 33){
            const msg = phrasesLow[Math.floor(Math.random() * phrasesLow.length)];
            bottomText.element.text = msg;
            return;
        }
        if(l >= 33 && l < 66){
            const msg = phrasesMid[Math.floor(Math.random() * phrasesMid.length)];
            bottomText.element.text = msg;
            return;
        }
        if(l >= 66){
            const msg = phrasesHigh[Math.floor(Math.random() * phrasesHigh.length)];
            bottomText.element.text = msg;
            return;
        }
        
    }
    window.addEventListener('click',() => {resetLuck();});
    window.addEventListener('touchstart',() => {resetLuck();});


    //Device resize and orientation listeners
    window.addEventListener('resize', () => this.resizeMethod(bolt));
    window.addEventListener('orientationchange', () => this.resizeMethod(bolt));
    this.resizeMethod(bolt);
};

MainScene.prototype.update = function(dt) {

};

MainScene.prototype.swap = function(old) {

};

MainScene.prototype.resizeMethod = function(clover) {
    
    clover.render.meshInstances[0].material.setParameter('uResolution', [canvas.clientHeight,canvas.clientWidth]);
    // clover.render.meshInstances[0].material.setParameter('uResolution', [canvas.height,canvas.width]);
};

function lerp1(a, b, t){
	return a + (b - a) * t;
}