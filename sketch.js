let img1; // 이미지 변수
let img2;
let img3;

//UI 변수
let button;
let popup;
let inner;
let urlInput;
let closeButton;


let rotationAngle = 0;
let Angle = 0; // 라이트 선 
let isDragging = false;
let dragStartAngle = 0;
let Type = 0;
let speed = 0.2; // 속도를 0.5로 설정하여 느리게 회전하도록

let textString = "Happy Holiday"; // 원형으로 배치할 문자열
let radius = 46; // 원의 반지름 ->텍스트 위치 조정할 때 씀

let stripeCount = 30; // 스트라이프 개수
let angleStep = 360 / stripeCount; // 각 스트라이프의 각도

//엘피 판 줄무늬 관련
let strokeWeights = [];
let opacities = [];
let maxRadius = 175;  // 최대 반지름 (지름 350)
let numCircles = 50;  // 그릴 원의 개수
let opacityUpdateInterval = 5;  // 오퍼시티 값을 갱신할 간격 (프레임 수 단위)

// 텍스처로 사용할 점들
let texturePoints = [];  

//전체적으로 사이즈 키우기
let lpScale = 1.5;


function preload() {
  img1 = loadImage('snowflake.png'); // 이미지 로드 (자신의 이미지 URL로 변경)
  img2 = loadImage('zigzag.png'); // 이미지 로드 (자신의 이미지 URL로 변경)
  img3 = loadImage('snow.png'); // 이미지 로드 (자신의 이미지 URL로 변경)
}


function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  
  textAlign(CENTER, CENTER); // 텍스트 중심 정렬

  input = createInput();
  input.input(typing);

  textFont("Bagel Fat One");
  getParam(); //공유용 추가
  settingUI(); //공유용 추가
  urlInput.value(location.href);//생으로 공유하기 눌렀을때도 팝업에 기본 주소가 뜨게

  
  // 각 원의 선 두께와 오퍼시티 초기화
  for (let s = 0; s < numCircles; s++) {
    strokeWeights[s] = random(1, 4);  // strokeWeight를 1, 2, 3 중 랜덤으로 설정
    opacities[s] = random(10, 20);    // 오퍼시티 값을 30~80 사이로 랜덤 설정
  }
  // 텍스처 한 번만 생성
  RandomTexture(0, 0, 150); 
  noStroke();
}

function typing() {
  textString = input.value();
  setParam(); //공유용 추가
  urlInput.value(location.href); //공유하기 팝업 내에 링크주소 들어가있게?
}
//여기서부터 공유용 팝업 추가
function setParam(){
  let url = new URL(location.href);
  url.searchParams.set("message",textString);
  history.pushState({},null,url);
}

function getParam(){
  let url = new URL(location.href);
  textString = url.searchParams.get("message");
  if(textString == null){
    textString = "Happy Holiday";
  }
}

function settingUI(){
  button = createButton("공유하기");
  popup = createDiv();
  popup.addClass("popup");

  inner = createDiv("아래 주소를 복사해서 공유해보세요");
  inner.addClass("inner");

  popup.child(inner);
  popup.hide(); //처음 로딩할때 팝업 안보이게

  urlInput = createInput();
  closeButton = createButton("닫기");
  inner.child(urlInput);
  inner.child(closeButton);

  button.mousePressed(openPopup);
  closeButton.mousePressed(closePopup);
}

function openPopup(){
  popup.show();

}
function closePopup() {
 popup.hide();

}
//여기까지 공유용 팝업 추가 끝

function draw() {
  background("#E6E5DC");    
  translate(width / 2, height / 2);
    // 랜덤 값 한 번만 배정(엘피 판 줄무늬)

  if (!isDragging) {
    rotationAngle += 1; // 자동 회전
  }
  
  scale(lpScale);
  // frameCount가 opacityUpdateInterval의 배수일 때만 오퍼시티 값 업데이트
  if (!mouseIsPressed) {
    if (frameCount % opacityUpdateInterval === 0) {
      for (let s = 0; s < numCircles; s++) {
        opacities[s] += random(-20, 20);  // 오퍼시티를 -20에서 20 사이로 변화
        opacities[s] = constrain(opacities[s], 0, 80);  // 오퍼시티 값을 0~255 사이로 제한
      }
    }
  }
  

  
  push();
   rotate(rotationAngle);  
    setLPStyle();  
  pop();
 
    lpStripe();
 
  push();
    rotate(rotationAngle); 
      setLabelStyle();
  pop();

   // 랜덤 색상 점들을 그리기



}

// LP 스타일 설정
function setLPStyle() {
  if (Type === 0) {
    noStroke();
    fill(0, 0, 0, 245); //검은색    
    ellipse(0, 0, 350, 350);   
    
  } else if (Type === 1) {
    noStroke();
    fill('#BE2525');
    ellipse(0, 0, 350, 350); 
    
  } else if (Type === 2) {
    noStroke();
    fill('#0F8432');
    ellipse(0, 0, 350, 350); 
      // 랜덤 색상 점들을 그리기
      for (let pt of texturePoints) {
    fill(pt.color);    
    ellipse(pt.x, pt.y, pt.size, pt.size);  // 점을 그리되 크기와 색상이 랜덤 
    }
    
  } else if (Type === 3) {
    noStroke();
    fill('#3F51B5');
    ellipse(0, 0, 350, 350);  



  }  
    stroke(1);
    strokeWeight(2);
    stroke(0, 0, 0, 30);
    noFill();
    ellipse(0, 0, 340, 340); //라인
    ellipse(0, 0, 270, 270); //라인
    ellipse(0, 0, 170, 170); //라인

    fill(0, 0, 0, 30);  
    ellipse(0, 0, 140, 140); // 제일 안쪽 어두운 영역


}
  
function RandomTexture(x, y, r) {
  
  texturePoints = [];  // 이전 점들을 초기화
    angleMode(RADIANS);
  // 원 내부에 랜덤한 점들을 생성
  for (let i = 0; i < 600; i++) {  // 1000개의 점을 생성
    // 랜덤한 각도와 반지름을 계산
    let angle = random(TWO_PI);
    let radius = random(r);
    
    // 점의 좌표 계산
    let nx = x + cos(angle) * radius;
    let ny = y + sin(angle) * radius;

    // 랜덤 색상과 크기를 생성
    // 녹색 계열의 색상과 랜덤 크기를 생성
    let colorValue = color(0, random(100, 255), 0, random(50, 150));  // 녹색 계열로 설정
    let size = random(1, 4);  // 점의 크기

    // 점을 배열에 저장
    texturePoints.push({x: nx, y: ny, color: colorValue, size: size});
  }
}


//라벨 스타일 설정
function setLabelStyle() {
    noStroke();
  if (Type === 0) {
    fill('#F0E6DC');
    ellipse(0, 0, 120, 120);
    //스트라이프    
    angleMode(RADIANS);
      for (let j = 0; j < stripeCount; j++) {
      let startAngle = j * angleStep;
      let endAngle = startAngle + angleStep; // 스트라이프의 두께 조정
      if (j % 2 === 0) {
        fill(255, 77, 41); // 빨간색
      } else {
        fill('#00A664'); // 녹색
      }
      noStroke();
      arc(0, 0, 80, 80, radians(startAngle), radians(endAngle), PIE);
        }

    //글자시작
    angleMode(DEGREES); // 각도를 도 단위로 사용
    //let angleStep = 360 / textString.length; // 각 글자 간의 각도
    let typeStep = 25; // 각 글자 간의 각도
    for (let i = 0; i < textString.length; i++) {
      let currentChar = textString.charAt(i); // 현재 문자
      let angle = i * typeStep; // 현재 문자의 각도
      push();
        fill(0,0,0,200); //검은글자
        textSize(24);
        rotate(angle); // 원의 중심에서 회전
        translate(0, -radius); // 반지름만큼 위로 이동
        // rotate(-angle); // 텍스트를 읽을 수 있도록 반대로 회전
        text(currentChar, 0, 0); // 텍스트 그리기
      pop();
    } //글자끝
    
  } else if (Type === 1) {
    
    fill('#B5A671');
    ellipse(0, 0, 125, 125);
    // fill('#F0E6DC');
    // ellipse(0, 0, 115, 115);  
    fill('#9F9262');
    ellipse(0, 0, 70, 70);
          //tint(255, 255, 255,80);
    image(img2,-35,-35,70,70);
      //글자시작
    angleMode(DEGREES); // 각도를 도 단위로 사용
    //let angleStep = 360 / textString.length; // 각 글자 간의 각도
    let typeStep = 25; // 각 글자 간의 각도
    for (let i = 0; i < textString.length; i++) {
      let currentChar = textString.charAt(i); // 현재 문자
      let angle = i * typeStep; // 현재 문자의 각도
      push();
        fill('#A01C1C'); //
        textSize(24);
        rotate(angle); // 원의 중심에서 회전
        translate(0, -radius); // 반지름만큼 위로 이동
        // rotate(-angle); // 텍스트를 읽을 수 있도록 반대로 회전
        text(currentChar, 0, 0); // 텍스트 그리기
      pop();
    } //글자끝
    

  } else if (Type === 2) {
    fill('#2E1913');
    ellipse(0, 0, 125, 125);
    tint(207, 94, 20,250);
      tint(255, 255, 255,80);
    image(img1,-30,-30,60,60);
 //글자시작
    angleMode(DEGREES); // 각도를 도 단위로 사용
    //let angleStep = 360 / textString.length; // 각 글자 간의 각도
    let typeStep = 25; // 각 글자 간의 각도
    for (let i = 0; i < textString.length; i++) {
      let currentChar = textString.charAt(i); // 현재 문자
      let angle = i * typeStep; // 현재 문자의 각도
      push();
        fill('#FF481E'); //
        textSize(24);
        rotate(angle); // 원의 중심에서 회전
        translate(0, -radius); // 반지름만큼 위로 이동
        // rotate(-angle); // 텍스트를 읽을 수 있도록 반대로 회전
        text(currentChar, 0, 0); // 텍스트 그리기
      pop();
    } //글자끝
    
    
    
    
  } else if (Type === 3) {
    // fill('#FF9800');
    // ellipse(0, 0, 125, 125);
    fill('#22203D');
    ellipse(0, 0, 125, 125);
        image(img3,-70,-70,140,140);
    // fill('#191843');
    // arc(0,0,122,122,0,180);
    // fill('#F11A63');
    // ellipse(0, 0, 60, 60);
    // fill("white");
    // ellipse(-15, -10, 5, 5);
    // ellipse(15, -10, 5, 5);
   // stroke("orange");
   // strokeWeight(3);
      strokeCap(ROUND); 
    arc(30,30,60,120)
   //글자시작
    angleMode(DEGREES); // 각도를 도 단위로 사용
    //let angleStep = 360 / textString.length; // 각 글자 간의 각도
    let typeStep = 25; // 각 글자 간의 각도
    for (let i = 0; i < textString.length; i++) {
      let currentChar = textString.charAt(i); // 현재 문자
      let angle = i * typeStep; // 현재 문자의 각도
      push();
        fill('#E3BD0C'); //
        textSize(24);
        rotate(angle); // 원의 중심에서 회전
        translate(0, -radius); // 반지름만큼 위로 이동
        // rotate(-angle); // 텍스트를 읽을 수 있도록 반대로 회전
        text(currentChar, 0, 0); // 텍스트 그리기    
      pop();

    } //글자끝
  }
  
  fill("#444444");
  ellipse(0, 0, 10, 10); //구멍
  
}



function lpStripe() {
  push();
  blendMode(SOFT_LIGHT);
  strokeCap(ROUND);  // 선의 끝을 둥글게 설정
  noFill();
  //fill(0,0,0,10);
  // 원을 차곡차곡 그리기
  // 원을 차곡차곡 그리기
  for (let s = 1; s <= numCircles; s++) {
    let radius = map(s, 1, numCircles, 10, maxRadius);  // 원의 반지름을 점차적으로 증가시킴
    let randomColor = color(205, 205, 205, opacities[s - 1]);  // 랜덤 색상과 투명도 생성
    
    stroke(randomColor);  // 선 색상 설정
    strokeWeight(strokeWeights[s - 1]);  // 선 두께 설정

    ellipse(0, 0, radius * 2, radius * 2);  // 원을 그리되, 반지름이 점차 커짐
  }
  pop();
  
   
   noFill();
    stroke(255,255,255); // 하얀색 선
    strokeWeight(3); 
    strokeJoin(ROUND); // 선의 끝을 둥글게 설정   
    rotate(Angle);
    // arc(0, 0, 160, 160, -3-30, 3-30);
    // arc(0, 0, 180, 180, -4-30, 4-30);
    // arc(0, 0, 240, 240, -5-30, 5-30);
    // arc(0, 0, 300, 300, -6-30, 6-30);
    // arc(0, 0, 318, 318, -6-30, 6-30);
  
  if (!mouseIsPressed) {
    // 1도씩 왔다갔다 하도록 회전 각도 조정 (속도 감소)
    Angle += speed*0.3;
    // 회전 각도가 -1도에서 1도 사이를 왔다 갔다 하도록 반전
    if (Angle >= 0.4 || Angle <= -0.4) {
      speed = -speed; // 방향 반전
    }
    
  }
   noStroke();
  // 빛
    fill(255, 255, 255, 10);
    arc(0, 0, 350, 350, -30, 30);
    arc(0, 0, 350, 350, -30 + 180, 30 + 180);
    // 그림자
    fill(0, 0, 0, 5);
    arc(0, 0, 350, 350, 30, 150);
    arc(0, 0, 350, 350, 210, 330);
 
}




// 마우스 클릭 처리
function mousePressed() {
    // LP판 영역 터치
  let d = dist(width / 2, height / 2, mouseX, mouseY);
  if (d < 170*lpScale) {
    changeType(1); // 스타일 변경
    }
  
 //  if (mouseX > 25 && mouseX < 475 && mouseY > 25 && mouseY < 475) {
 //   changeType(1); // 스타일 변경
//  } 
  
  // LP 회전 영역 클릭 및 드래그 시작
  if (isInsideLP(mouseX, mouseY)) {
    startDragging(mouseX, mouseY);
  }
}

function mouseDragged() {
  if (isDragging) {
    updateRotation(mouseX, mouseY);
  }
}

function mouseReleased() {
  stopDragging();
}


// 모바일 터치 이벤트
function touchStarted() {
    // LP판 영역 터치
  let d = dist(width / 2, height / 2, touches[0].x, touches[0].y);
  if (d > 50*lpScale && d < 170*lpScale) {
    changeType(1); // 스타일 변경
    }
  // LP 회전 영역 클릭 및 드래그 시작

  //return false; 대신 preventDefault()로 제어
  if (isInsideLP(touches[0].x, touches[0].y)) {
    startDragging(touches[0].x, touches[0].y);
    event.preventDefault(); // 기본 동작 방지
  }
}

function touchMoved() {

  if (isDragging) {
    updateRotation(touches[0].x, touches[0].y);
    event.preventDefault(); // 기본 동작 방지
  }
}

 function touchEnded() { 
  stopDragging();

}

// LP 영역 안에 있는지 확인
function isInsideLP(x, y) {
  let d = dist(x, y, width / 2, height / 2);
  return d < 600/2;
}

// 스타일 변경
function changeType(direction) {
  Type = (Type + direction + 4) % 4; // 4가지 스타일 순환
}

// 드래그 시작
function startDragging(x, y) {
  isDragging = true;
  dragStartAngle = atan2(y - height / 2, x - width / 2) - rotationAngle;
}

// 회전 업데이트
function updateRotation(x, y) {
  let currentAngle = atan2(y - height / 2, x - width / 2);
  rotationAngle = currentAngle - dragStartAngle;
}

// 드래그 종료
function stopDragging() {
  isDragging = false;
}
