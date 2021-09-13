var PLAY = 1;
var END = 0;
var gameState = PLAY;

var thief, thief_running, thief_collided;
var ground, invisibleGround, groundImage;
var backgroundImg;
var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;
var diamonds=0;


var gameOver, restart;


function preload(){
  thief_running = loadAnimation("Theif1.png","Theif2.png","Theif3.png","Theif4.png","Theif5.png","Theif6.png");
  thief_collided = loadAnimation("Theif3.png");

  backgroundImg = loadImage("city background.jpg");
  coinImage = loadAnimation("coin1.png","coin2.png","coin3.png","coin4.png","coin5.png","coin6.png")
  obstacle2 = loadImage("zom2.png");
  obstacle1 = loadImage("zom1.png");
  obstacle3 = loadImage("obstacle.png");
  gameOverImg = loadImage("overgame.png");
  restartImg = loadImage("restart2.png");
  coinSound = loadSound("coin.wav");
}

function setup() {
  createCanvas(600, 200);
  background1 = createSprite(200,180,400,20);
  background1.addImage("city background",backgroundImg);
  background1.x = background1.width /2;
  background1.velocityX = -2; 

  
  invisibleGround= createSprite(300,195,600,10);
  invisibleGround.visible= false;

  thief = createSprite(50,150,20,50,);
  thief.addAnimation("running",thief_running)
  thief.scale = 0.2;


  gameOver = createSprite(300,85);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  

  obstaclesGroup.debug = true;
  
  score = 0;
  diamonds = 0;
}

function draw() {
  background(0);
  drawSprites();
  textSize(15);
  textFont("copperplate gothic");
  fill("white");
  text("💎: "+ diamonds,500,45);
  text("Score: "+ score, 500,25);
//text("life: "+ life , 500,60);
 
  if (gameState===PLAY){
   score = score + Math.round(getFrameRate()/120);
    if(score >= 0){
      background1.velocityX = -6;
    }
  
    if(keyDown("space") && thief.y >= 139) {
      thief.velocityY = -12;
      
    }
  
    thief.velocityY = thief.velocityY + 0.8
  
    if(background1.x <270){
      background1.x = background1.width /2;
     }
  
     thief.collide(invisibleGround);
    
    spawnCoin();
    spawnObstacles();
    if(coinGroup.isTouching(thief)){
      score=score+1;
      diamonds=diamonds+1;
      coinGroup.destroyEach();
      coinSound.play();
    }
  
   if(obstaclesGroup.isTouching(thief)){
        gameState = END;
      
    } 
  }


  
  else if (gameState === END ) {
    
    gameOver.visible = true;
    gameOver.scale = 0.25
    restart.visible = true;
    restart.scale = 0.25;
    thief.addAnimation("collided",thief_collided);
    
    //set velcity of each game object to 0
    background1.velocityX = 0;
    thief.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    thief.changeAnimation("collided",thief_collided);
    thief.scale =0.25;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 180 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addAnimation("coins",coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = thief.depth;
    thief.depth = thief.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);    
  
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              
              break;
    }
        
    obstacle.velocityX = -6;
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.19;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  thief.changeAnimation("running",thief_running);
  thief.scale =0.2;
  
  score = 0;
  diamonds = 0;
  
}