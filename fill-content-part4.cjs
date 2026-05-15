/**
 * fill-content-part4.cjs — 填充剩余 36 篇 PEP 英语 4-6 年级
 * 运行: node fill-content-part4.cjs
 */
const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, 'src/data/textbooks-data.json');
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const C = {};

// ===== PEP 四年级上册 (6 units) =====
C['pep-4-1-001'] = "Unit 1 My Classroom\n\nLet's Talk:\nZhang Peng: Hey, Zhang Peng. We have a new classroom!\nMike: Really? Let's go and see!\nZhang Peng: Wow! It's so big!\nMike: Look! There is a new blackboard.\n\nLet's Learn:\nclassroom, window, door, picture, board, light, desk, chair, fan, wall, floor\n\nLet's Spell:\ncake, face, name, make, date, plate\n\nRead and Write:\nThis is my classroom. It's big and clean. There are 20 desks and 20 chairs. The teacher's desk is near the window. I like my classroom.";

C['pep-4-1-002'] = "Unit 2 My Schoolbag\n\nLet's Talk:\nAmy: I have a new schoolbag.\nChen Jie: Really? What colour is it?\nAmy: It's blue and white.\nChen Jie: What's in your schoolbag?\nAmy: An English book, a maths book, three storybooks and a pencil box.\n\nLet's Learn:\nschoolbag, maths book, English book, Chinese book, storybook, notebook, pen, pencil, ruler, eraser\n\nLet's Spell:\nlike, kite, five, nine, rice, fine\n\nRead and Write:\nI have a new schoolbag. It's heavy. I have an English book, a Chinese book, a maths book and three storybooks in it. I like reading storybooks.";

C['pep-4-1-003'] = "Unit 3 My Friends\n\nLet's Talk:\nMike: Hi, John. I have a new friend.\nJohn: Really? A Chinese friend?\nMike: Yes, he's very friendly.\nJohn: What's his name?\nMike: His name is Zhang Peng.\n\nLet's Learn:\nfriendly, quiet, tall, strong, short, thin, long hair, short hair, glasses, shoes\n\nLet's Spell:\nnose, note, Coke, Mr Jones, hope, home\n\nRead and Write:\nI have a good friend. He is tall and strong. He has short black hair and big eyes. He is friendly and quiet. We often play together.";

C['pep-4-1-004'] = "Unit 4 My Home\n\nLet's Talk:\nAmy: Mum, where is my bag?\nMum: Is it in your bedroom?\nAmy: No, it isn't.\nMum: Is it in the living room?\nAmy: No, it isn't. Oh, it's in the study!\n\nLet's Learn:\nbedroom, living room, study, kitchen, bathroom, bed, sofa, table, fridge, phone\n\nLet's Spell:\nbox, fox, dog, orange, doll, hot\n\nRead and Write:\nThis is my home. We have a living room, a kitchen, and three bedrooms. My bedroom is small but nice. There is a bed, a desk and a chair. I like my home.";

C['pep-4-1-005'] = "Unit 5 Dinner's Ready\n\nLet's Talk:\nMum: Dinner's ready! Help yourself!\nMike: Thanks.\nMum: What would you like?\nMike: I'd like some beef and rice, please.\nMum: Would you like some soup?\nMike: Yes, please!\n\nLet's Learn:\nbeef, chicken, noodles, soup, vegetable, rice, fish, juice, bread, milk, water\n\nLet's Spell:\nme, he, she, we, be, bee\n\nRead and Write:\nI'm hungry. I'd like some rice, chicken and soup for dinner. I'd like some milk, too. Yummy! What would you like for dinner?";

C['pep-4-1-006'] = "Unit 6 Meet My Family\n\nLet's Talk:\nAmy: How many people are there in your family?\nMike: Nine. Look! This is my family photo.\nAmy: Who's this?\nMike: He's my uncle.\nAmy: What's his job?\nMike: He's a doctor.\n\nLet's Learn:\nparents, uncle, aunt, baby, cousin, doctor, nurse, driver, farmer, cook, teacher, student\n\nLet's Spell:\nup, cup, bus, duck, cut, but\n\nRead and Write:\nThis is my family. There are five people. My father is a doctor. My mother is a nurse. My brother is a student. I am a student, too. I love my family.";

// ===== PEP 四年级下册 =====
C['pep-4-2-001'] = "Unit 1 My School\n\nLet's Talk:\nChen Jie: Welcome to our school! This is my classroom.\nVisitor: It's so big! How many students are there in your class?\nChen Jie: Forty-five.\nVisitor: Is that the library?\nChen Jie: Yes, it is. We can read books there.\n\nLet's Learn:\nfirst floor, second floor, teachers' office, library, playground, computer room, music room, art room, gym\n\nLet's Spell:\ner, water, tiger, sister, dinner, computer\n\nRead and Write:\nThis is my school. It's big and beautiful. We have a playground, a library and a music room. My classroom is on the first floor. I like my school.";

C['pep-4-2-002'] = "Unit 2 What Time Is It\n\nLet's Talk:\nMike: What time is it?\nZhang Peng: It's 6 o'clock. It's time for dinner.\nMike: Let's go to the dining hall.\nZhang Peng: OK!\n\nLet's Learn:\nbreakfast, lunch, dinner, English class, music class, PE class, get up, go to school, go home, go to bed\n\nLet's Spell:\nir, girl, bird, birth, first, third\n\nRead and Write:\nHi, I'm Mike. I get up at 6:30. I go to school at 7:30. I have lunch at 12:00. I go home at 4:30. I go to bed at 9:00. What time do you get up?";

C['pep-4-2-003'] = "Unit 3 Weather\n\nLet's Talk:\nMike: It's cold outside. Please wear your coat.\nAmy: OK. What's the weather like in Beijing?\nMike: It's sunny and warm.\nAmy: What about London?\nMike: It's rainy and cool.\n\nLet's Learn:\ncold, cool, warm, hot, sunny, windy, cloudy, snowy, rainy, weather, outside\n\nLet's Spell:\nar, arm, car, card, far, farm\n\nRead and Write:\nToday is sunny and warm. I can play outside. I wear my T-shirt and shorts. In winter, it's cold and snowy. I can make a snowman. I love different weather.";

C['pep-4-2-004'] = "Unit 4 At the Farm\n\nLet's Talk:\nMike: Look at the green beans. They're so long!\nSarah: Yes, and the potatoes are big.\nMike: What are those?\nFarmer: They're tomatoes. Try some! They're good.\nSarah: Thanks. Yum!\n\nLet's Learn:\ntomato, potato, green bean, carrot, onion, horse, cow, sheep, goat, hen, lamb\n\nLet's Spell:\nor, horse, fork, for, short, born\n\nRead and Write:\nWelcome to the farm! Look at the animals. These are horses. Those are cows. And there are many sheep. The vegetables are fresh. I like the big red tomatoes and the long green beans.";

C['pep-4-2-005'] = "Unit 5 My Clothes\n\nLet's Talk:\nAmy: Are these your pants?\nSarah: No, they aren't. They're Mike's.\nAmy: Whose coat is this?\nSarah: It's mine.\n\nLet's Learn:\nshirt, pants, shorts, dress, coat, sweater, skirt, hat, socks, shoes, jacket\n\nLet's Spell:\nle, apple, people, table, uncle\n\nRead and Write:\nI have many clothes. Today I wear a blue shirt and white pants. I have a red dress for parties. In winter, I wear a warm coat and a hat. I like my clothes.";

C['pep-4-2-006'] = "Unit 6 Shopping\n\nLet's Talk:\nAssistant: Can I help you?\nJohn: Yes. This dress is pretty. How much is it?\nAssistant: It's eighty-five yuan.\nJohn: Oh, that's expensive!\nAssistant: But it's very nice.\n\nLet's Learn:\ngloves, scarf, umbrella, sunglasses, pretty, expensive, cheap, nice\n\nLet's Spell:\nth, this, that, these, those, mother, brother\n\nRead and Write:\nToday is sunny. I go shopping with my mum. I want to buy a hat. This blue hat is pretty. It's fifty yuan. I also like these gloves. They're cheap. I'm happy with my new things.";

// ===== PEP 五年级上册 =====
C['pep-5-1-001'] = "Unit 1 What's He Like\n\nLet's Talk:\nChen Jie: Do you know Mr Young?\nMike: No, I don't. Who is he?\nChen Jie: He's our new music teacher.\nMike: What's he like?\nChen Jie: He's young and funny.\n\nLet's Learn:\nold, young, funny, kind, strict, polite, hard-working, helpful, clever, shy\n\nRead and Write:\nMy English teacher is Miss White. She is young and kind. She is hard-working and helpful. We all like her. Our maths teacher is Mr Wang. He is old but funny.";

C['pep-5-1-002'] = "Unit 2 My Week\n\nLet's Talk:\nMike: What do you have on Mondays?\nJohn: I have maths, English and music.\nMike: What do you often do on weekends?\nJohn: I often read books and play football.\n\nLet's Learn:\nMonday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, weekend, wash, watch, read, play\n\nRead and Write:\nI go to school from Monday to Friday. On Mondays, I have Chinese, maths and PE. On weekends, I often do my homework and play basketball. I like weekends.";

C['pep-5-1-003'] = "Unit 3 What Would You Like\n\nLet's Talk:\nSarah: I'm hungry. What would you like to eat?\nMike: I'd like a sandwich, please.\nSarah: What would you like to drink?\nMike: I'd like some tea.\n\nLet's Learn:\nsandwich, hamburger, hot dog, salad, ice cream, tea, coffee, juice, milk, water, bread\n\nRead and Write:\nMy favourite food is pizza. It's delicious. I like fruit salad, too. For breakfast, I'd like milk and bread. For lunch, I'd like rice, chicken and vegetables. I eat healthy food every day.";

C['pep-5-1-004'] = "Unit 4 What Can You Do\n\nLet's Talk:\nZhang Peng: We'll have a party next Tuesday!\nMike: Great! What can you do?\nZhang Peng: I can sing English songs.\nMike: Wonderful! I can draw pictures.\n\nLet's Learn:\nsing, dance, draw, cook, swim, play basketball, play ping-pong, speak English, do kung fu\n\nRead and Write:\nI'm helpful at home. I can clean the room and wash the clothes. I can cook noodles, too. I can't cook well, but I can learn. What can you do? I can dance and sing, but I can't swim.";

C['pep-5-1-005'] = "Unit 5 There Is a Big Bed\n\nLet's Talk:\nSarah: Your room is really nice!\nZhang Peng: Thanks. There is a big bed.\nSarah: There is a nice photo, too.\nZhang Peng: Yes, it's my family photo.\n\nLet's Learn:\nclock, plant, bottle, photo, bike, front, between, above, beside, behind\n\nRead and Write:\nThis is my bedroom. There is a big bed near the window. There is a desk beside the bed. On the desk, there is a computer and a lamp. There are many books on the shelf. Behind the door, there is a bike. I like my room.";

C['pep-5-1-006'] = "Unit 6 In a Nature Park\n\nLet's Talk:\nChen Jie: Let's go to the nature park!\nMike: Is there a river in the park?\nChen Jie: Yes, there is.\nMike: Are there any bridges?\nChen Jie: No, there aren't. But there are many trees.\n\nLet's Learn:\nforest, hill, tree, river, lake, mountain, bridge, house, flower, grass, path\n\nRead and Write:\nI live near a nature park. There is a forest and a lake in the park. There are many flowers and trees. There is a path near the lake. There aren't any tall buildings. The air is fresh. I like to run and play there.";

// ===== PEP 五年级下册 =====
C['pep-5-2-001'] = "Unit 1 My Day\n\nLet's Talk:\nPedro: When do you finish class in the morning?\nMike: We finish class at 11:30.\nPedro: When do you eat lunch?\nMike: I eat lunch at 11:40.\n\nLet's Learn:\ndo morning exercises, eat breakfast, have class, play sports, eat dinner, clean my room, go for a walk, go shopping, take a dancing class\n\nRead and Write:\nI'm Mike. I usually get up at 6:30. I eat breakfast at 7:00. I go to school at 7:30. Classes start at 8:00. I eat lunch at school. I go home at 4:30. In the evening, I do my homework and read books. I go to bed at 9:00.";

C['pep-5-2-002'] = "Unit 2 My Favourite Season\n\nLet's Talk:\nMike: Which season do you like best?\nChen Jie: I like summer best.\nMike: Why?\nChen Jie: Because I can go swimming.\n\nLet's Learn:\nspring, summer, autumn, winter, season, picnic, go on a picnic, go swimming, pick apples, make a snowman, plant flowers\n\nRead and Write:\nI like spring best. It's warm and sunny. There are beautiful flowers everywhere. I can go on a picnic with my family. In spring, the trees are green. The birds sing in the trees. I love spring.";

C['pep-5-2-003'] = "Unit 3 My School Calendar\n\nLet's Talk:\nMike: We have a few fun things in spring.\nZhang Peng: Really? What are they?\nMike: We have a sports meet and a school trip.\n\nLet's Learn:\nJanuary, February, March, April, May, June, July, August, September, October, November, December, birthday, holiday\n\nRead and Write:\nThere are 12 months in a year. My birthday is in May. I like May because we have a school trip. I also like December because we have winter vacation. My favourite month is October. The weather is cool and nice.";

C['pep-5-2-004'] = "Unit 4 When Is the Art Show\n\nLet's Talk:\nMike: When is the art show?\nZhang Peng: It's on May 1st.\nMike: When is the reading festival?\nZhang Peng: It's on May 5th.\n\nLet's Learn:\nfirst, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth, eleventh, twelfth, twentieth\n\nRead and Write:\nApril is a busy month. The sports meet is on April 4th. The English test is on April 15th. My birthday is on April 20th. I will have a birthday party. My mother will make a big cake. I'm very excited!";

C['pep-5-2-005'] = "Unit 5 Whose Dog Is It\n\nLet's Talk:\nMike: The dog is sleeping. Whose dog is this?\nChen Jie: It's his dog. The dog is his.\nMike: Look! The cat is playing with a ball.\n\nLet's Learn:\nhis, hers, theirs, ours, yours, mine, climbing, eating, playing, sleeping, jumping, drinking\n\nRead and Write:\nLook at the animals in the park. The dog is running. It's Mike's dog. The cat is sleeping. It's Chen Jie's cat. The birds are singing. They are in the tree. The fish are swimming in the lake. Animals are fun to watch!";

C['pep-5-2-006'] = "Unit 6 Work Quietly\n\nLet's Talk:\nMike: What are they doing?\nChen Jie: They're having a maths class.\nMike: What is the little girl doing?\nChen Jie: She's reading a book.\n\nLet's Learn:\ndoing morning exercises, having class, eating lunch, reading a book, listening to music, keeping quiet, talking, walking, running\n\nRead and Write:\nIt's 9:00 in the morning. The students are having an English class. They are reading and writing. They are working quietly. The teacher is walking around and helping them. Everyone is busy. School is a good place to learn.";

// ===== PEP 六年级上册 =====
C['pep-6-1-001'] = "Unit 1 How Can I Get There\n\nLet's Talk:\nMike: Where is the science museum?\nWu Yifan: It's near the library.\nMike: How can I get there?\nWu Yifan: Turn left at the school. Then go straight.\n\nLet's Learn:\nscience museum, post office, bookstore, cinema, hospital, crossing, turn left, turn right, go straight, near, next to\n\nRead and Write:\nI want to go to the bookstore. It's near the cinema. First, turn right at the school. Then go straight for five minutes. The bookstore is on the left. I want to buy some books.";

C['pep-6-1-002'] = "Unit 2 Ways to Go to School\n\nLet's Talk:\nMike: How do you come to school?\nAmy: I usually come by bus.\nMike: How does your father go to work?\nAmy: He goes by car.\n\nLet's Learn:\non foot, by bus, by bike, by car, by train, by subway, by ship, by plane, slow, fast, stop, wait\n\nRead and Write:\nI live far from school. I usually come to school by bus. Sometimes I come by bike with my dad. My mother goes to work by car. We should pay attention to the traffic lights. Red means stop. Green means go.";

C['pep-6-1-003'] = "Unit 3 My Weekend Plan\n\nLet's Talk:\nMike: What are you going to do tomorrow?\nSarah: I'm going to see a film.\nMike: When are you going?\nSarah: This afternoon.\n\nLet's Learn:\nsee a film, take a trip, go to the supermarket, visit my grandparents, read a book, draw pictures, do homework, have a picnic\n\nRead and Write:\nI have a plan for this weekend. On Saturday morning, I'm going to do my homework. In the afternoon, I'm going to the library. On Sunday, I'm going to visit my grandparents. We are going to have lunch together.";

C['pep-6-1-004'] = "Unit 4 I Have a Pen Pal\n\nLet's Talk:\nMike: What are Peter's hobbies?\nZhang Peng: He likes reading stories.\nMike: Does he live in Sydney?\nZhang Peng: Yes, he does.\n\nLet's Learn:\nreading stories, singing, dancing, playing football, doing kung fu, watching TV, going hiking, cooking\n\nRead and Write:\nI have a pen pal. Her name is Lucy. She lives in London. She likes reading and drawing. She likes playing the piano, too. We often write emails to each other. I'm going to visit her one day.";

C['pep-6-1-005'] = "Unit 5 What Does He Do\n\nLet's Talk:\nSarah: What does your father do?\nMike: He's a doctor.\nSarah: Where does he work?\nMike: He works in a hospital.\n\nLet's Learn:\nworker, postman, businessman, fisherman, scientist, pilot, coach, police officer, factory, university\n\nRead and Write:\nEveryone has a dream job. My father is a teacher. He works in a school. My mother is a nurse. She works in a hospital. I want to be a scientist. I like science very much. I will study hard.";

C['pep-6-1-006'] = "Unit 6 How Do You Feel\n\nLet's Talk:\nMike: How does Sam feel?\nSarah: He's worried.\nMike: Why?\nSarah: Because he will have a test.\n\nLet's Learn:\nhappy, sad, angry, afraid, worried, worried, cold, hot, tired, ill, feel, should\n\nRead and Write:\nI have many feelings. I feel happy when I get a good grade. I feel sad when I lose my toy. I feel angry when someone is mean. I feel afraid when it's dark. But most of the time, I'm happy. We should share our feelings with others.";

// ===== PEP 六年级下册 =====
C['pep-6-2-001'] = "Unit 1 How Tall Are You\n\nLet's Talk:\nMike: How tall are you?\nZhang Peng: I'm 1.65 metres.\nMike: Who is taller than you?\nZhang Peng: My father is taller than me.\n\nLet's Learn:\ntaller, shorter, longer, younger, older, stronger, heavier, bigger, smaller, thinner\n\nRead and Write:\nLet's compare! I am 1.5 metres tall. My friend Tom is 1.55 metres. He is taller than me. I am 12 years old. Tom is 13. He is older than me. My bag is 3 kg. Tom's bag is 2.5 kg. My bag is heavier than his.";

C['pep-6-2-002'] = "Unit 2 Last Weekend\n\nLet's Talk:\nMike: What did you do last weekend?\nJohn: I cleaned my room and washed my clothes.\nMike: Did you watch TV?\nJohn: Yes, I did.\n\nLet's Learn:\ncleaned, washed, watched, stayed, cooked, visited, played, read, saw, had\n\nRead and Write:\nLast weekend was busy. On Saturday morning, I cleaned my room. In the afternoon, I visited my grandparents. On Sunday, I did my homework in the morning. In the afternoon, I played football with my friends. I had a good weekend!";

C['pep-6-2-003'] = "Unit 3 Where Did You Go\n\nLet's Talk:\nAmy: Where did you go over the winter holiday?\nMike: I went to Sanya.\nAmy: How did you go there?\nMike: I went there by plane.\n\nLet's Learn:\nwent, rode, hurt, bought, ate, took, went camping, went fishing, took pictures\n\nRead and Write:\nI went to Beijing last summer holiday. I went there by train. I visited the Great Wall. It was very long and amazing. I took many pictures. I also ate Beijing duck. It was delicious. I had a wonderful trip!";

C['pep-6-2-004'] = "Unit 4 Then and Now\n\nLet's Talk:\nMike: I was short and thin before. Now I'm tall and strong.\nChen Jie: I couldn't ride a bike before. Now I can ride very well.\n\nLet's Learn:\nbefore, now, was, were, could, couldn't, can, can't, different, change, Internet, active\n\nRead and Write:\nI have changed a lot. Before, I was short and I couldn't ride a bike. Now I'm tall and I can ride very well. Before, I didn't like reading. Now I like reading storybooks. Before, I was shy. Now I'm active and have many friends. How have you changed?";

C['pep-6-2-005'] = "Unit 5 What's the Matter\n\nLet's Talk:\nMike: What's the matter, Amy?\nAmy: I have a headache.\nMike: Oh, I'm sorry to hear that. You should see a doctor.\n\nLet's Learn:\nhave a headache, have a fever, have a cold, have a cough, have a toothache, have a stomachache, see a doctor, take medicine, drink water\n\nRead and Write:\nI feel sick today. I have a cold and a cough. My mother says I should drink more water and have a rest. I should take some medicine, too. I hope I can get better soon. I don't like being sick. Being healthy is important.";

C['pep-6-2-006'] = "Unit 6 Goodbye\n\nLet's Talk:\nMike: We're going to leave our primary school.\nAmy: Yes. I'm so sad to say goodbye.\nMike: But we will be friends forever.\nAmy: Let's keep in touch!\n\nLet's Learn:\nprimary school, goodbye, friend, forever, remember, miss, share, keep in touch, classmate, memories\n\nRead and Write:\nDear classmates,\nWe are going to leave our primary school. I will miss you all. We have so many happy memories together. We played, learned, and grew up together. Let's be friends forever. Please keep in touch. I wish you all the best in middle school!\nYours,\nMike";

// ============ Fill Logic ============
const emptyItems = data.filter(x => !x.content || !x.content.trim());
console.log(`找到 ${emptyItems.length} 篇空内容课文`);
console.log(`提供 ${Object.keys(C).length} 篇内容`);

let filled = 0;
for (const item of data) {
  if (C[item.id]) {
    item.content = C[item.id];
    filled++;
  }
}

const remaining = data.filter(x => !x.content || !x.content.trim());
console.log(`已填充 ${filled} 篇，剩余 ${remaining.length} 篇空内容`);

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`已保存到 ${DATA_PATH}`);

if (remaining.length > 0) {
  console.log('剩余空内容:');
  for (const r of remaining) {
    console.log(`  [${r.id}] ${r.title}`);
  }
} else {
  console.log('✅ 全部填充完成！');
}
