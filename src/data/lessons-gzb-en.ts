export type Grade = '1' | '2' | '3' | '4' | '5' | '6';
export type Subject = '语文' | '英语';
export type LessonType = 'dialogue' | 'song' | 'rhyme' | 'story' | 'vocabulary' | 'revision' | 'names';
export type Semester = '上册' | '下册';

export interface Lesson {
  id: string;
  title: string;
  author?: string;
  content: string;
  type: LessonType;
  translation?: string;
  notes?: string;
  grade: Grade;
  subject: Subject;
  lessonNumber: number;
  chapter?: string;
  semester: Semester;
  audioUrl?: string;
}

export const gzbEnglishLessons: Lesson[] = [
  // ==================== 一年级上册英语 ====================
  {
    id: 'gzb-1-1-001',
    title: "UNIT 1 HELLO, I'M ANDY",
    content: `SCHOOL

LET'S SING
Listen, sing and act.

Hi, HELLO.
WHAT'S YOUR NAME?

Hi, hello.
What's your name?
What's your name?
What's your name?

Hi, hello.
What's your name?
My name is Andy.
My name is Andy.

LET'S CHANT
Listen, say and act.

Hello, Ben.
Hello, Sue.
Hello, Jim.
How are you?
Superb! Good! OK! Great!

LET'S PLAY
Listen and say.

Bobby.
Here, Mr Leo.
Zhou Yongxian.
Here, Miss Gao.

LET'S TRY
Listen and say.

Hello, my name is Julia.
Hi, my name is Chen Jiamin.

LET'S MAKE
Make a name tag.
You need:
Stick your photo.
Write your name.
Pull the string through the holes.
Introduce yourself.

Hello!
My name is Julia.

STORY TIME
Look, listen and act.

Hi, my name is Andy.
What's your name?
I'm Koto.
I'm Bobby.
My name is Amy.
Good morning.
I'm Mr Leo.
Good morning, Mr Leo.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 1,
    chapter: 'UNIT 1',
    semester: '上册',
    translation: `第一单元 你好，我是安迪

学校
一起来唱一唱
听录音，唱一唱并演一演。

嗨，你好。
你叫什么名字？

嗨，你好。
你叫什么名字？
你叫什么名字？
你叫什么名字？

嗨，你好。
你叫什么名字？
我的名字叫安迪。
我的名字叫安迪。

一起来吟唱
听录音，说一说并演一演。

你好，本。
你好，休。
你好，吉姆。
你好吗？
好极了！很好！过得去！非常好！

一起玩游戏
听录音并说一说。

波比。
我在这，狮子老师。
周永先。
我在这，高老师。

一起来试试
听录音并说一说。

你好，我的名字叫茱莉亚。
嗨，我的名字叫陈嘉敏。

动手做一做吧
做一张名牌。
你需要：
贴上你的照片。
写上你的名字。
将挂绳穿过圆孔。
介绍你自己。

你好！
我的名字叫茱莉亚。

故事时间
看图、听录音并演一演。

嗨，我的名字叫安迪。
你叫什么名字？
我叫库图。
我是波比。
我的名字叫艾米。
早上好。
我是狮子老师。
早上好，狮子老师。`,
  },
  {
    id: 'gzb-1-1-002',
    title: "UNIT 2 I HAVE A NEW BAG",
    content: `LET'S TALK
Listen and say.

Hi, Amy. I have a new bag.
Oh, it's nice.
Thank you.
Here you are.
Thank you.

LET'S CHANT
Listen and say.

I have a new bag.
I have a new book.
I have a new ruler.
I have a new pencil.

LET'S PLAY
Listen and guess.

I have something in my hand.
What is it?
Is it a book?
No, it isn't.
Is it a ruler?
Yes, it is.

LET'S TRY
Listen and complete.

I have a new bag.
It's blue.
I have a new pencil.
It's red.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 2,
    chapter: 'UNIT 2',
    semester: '上册',
    translation: `第二单元 我有一个新书包

一起来聊一聊
听录音并说一说。

嗨，艾米。我有一个新书包。
哦，真好看。
谢谢你。
给你。
谢谢你。

一起来吟唱
听录音，说一说。

我有一个新书包。
我有一本新书。
我有一把新尺子。
我有一支新铅笔。

一起玩游戏
听录音，猜一猜。

我手里有东西。
它是什么？
是一本书吗？
不，不是。
是一把尺子吗？
是的，它是。

一起来试试
听录音，完成练习。

我有一个新书包。
它是蓝色的。
我有一支新铅笔。
它是红色的。`,
  },
  {
    id: 'gzb-1-1-003',
    title: "UNIT 3 COUNT FROM ONE TO TEN",
    content: `LET'S COUNT
One, two, three, four, five,
six, seven, eight, nine, ten.

One elephant goes.
Two elephants go.
Three elephants go.
Four, five, six, seven, eight, nine, ten!

LET'S CHANT
One, two, three, four, five,
once I caught a fish alive.
Six, seven, eight, nine, ten,
then I let it go again.

LET'S SING
The numbers song.

One, two, three, four, five,
once I caught a fish alive.
Six, seven, eight, nine, ten,
then I let it go again.
Why did you let it go?
Because it bit my finger so.
Which finger did it bite?
The little finger on the right.

LET'S PLAY
Count and say.

How many?
One, two, three... ten.
Very good!`,
    type: 'song',
    grade: '1',
    subject: '英语',
    lessonNumber: 3,
    chapter: 'UNIT 3',
    semester: '上册',
    translation: `第三单元 数一数

一起来数数
一，二，三，四，五，
六，七，八，九，十。

一只大象走。
两只大象走。
三只大象走。
四，五，六，七，八，九，十！

一起来吟唱
一，二，三，四，五，
我曾经抓住一条活鱼。
六，七，八，九，十，
然后我又把它放了。

唱一唱
数字歌。

一，二，三，四，五，
我曾经抓住一条活鱼。
六，七，八，九，十，
然后我又把它放了。
你为什么放了它？
因为它咬了我的手指。
它咬了哪根手指？
右手的小手指。

一起玩一玩
数一数，说一说。

有多少？
一，二，三...十。
非常好！`,
  },
  {
    id: 'gzb-1-1-004',
    title: "REVISION (I)",
    content: `REVIEW THE UNITS

What's your name?
My name is Amy.

I have a new bag.
Thank you.

One, two, three... ten.

Let's play games and sing songs!
Good job!`,
    type: 'revision',
    grade: '1',
    subject: '英语',
    lessonNumber: 4,
    chapter: 'REVISION',
    semester: '上册',
    translation: `复习（一）

你叫什么名字？
我的名字叫艾米。

我有一个新书包。
谢谢你。

一，二，三...十。

一起玩游戏和唱歌吧！
做得好！`,
  },
  {
    id: 'gzb-1-1-005',
    title: "UNIT 4 I LIKE GREEN",
    content: `LET'S TALK
Listen and say.

I like green.
I like red.
I like blue.
I like yellow.

What colour is it?
It's green.
I like it.

LET'S CHANT
Green, green, I like green.
Red, red, I like red.
Blue, blue, I like blue.
Yellow, yellow, I like yellow.

LET'S PLAY
Colour and say.

Colour the balloon green.
Colour the apple red.
Colour the sky blue.
Colour the sun yellow.

LET'S TRY
Listen and match.

I like green.
It's a green book.
I like red.
It's a red bag.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 5,
    chapter: 'UNIT 4',
    semester: '上册',
    translation: `第四单元 我喜欢绿色

一起来聊一聊
听录音，说一说。

我喜欢绿色。
我喜欢红色。
我喜欢蓝色。
我喜欢黄色。

它是什么颜色的？
它是绿色的。
我喜欢它。

一起来吟唱
绿色，绿色，我喜欢绿色。
红色，红色，我喜欢红色。
蓝色，蓝色，我喜欢蓝色。
黄色，黄色，我喜欢黄色。

一起玩一玩
涂颜色，说一说。

把气球涂成绿色。
把苹果涂成红色。
把天空涂成蓝色。
把太阳涂成黄色。

一起来试试
听录音，连一连。

我喜欢绿色。
它是一本绿色的书。
我喜欢红色。
它是一个红色的书包。`,
  },
  {
    id: 'gzb-1-1-006',
    title: "UNIT 5 HERE'S MY SCOOTER",
    content: `LET'S TALK
Listen and say.

Look! Here's my scooter.
Cool! It's nice.
Here you are.
Thank you. Can I have a try?
Sure. Here you go.

LET'S CHANT
Here's my scooter.
Here's my car.
Here's my train.
Here's my plane.

LET'S PLAY
Find and say.

What's this?
It's a scooter.
What's that?
It's a car.

LET'S TRY
Listen and choose.

Here is my new scooter.
Here is my new car.
Here is my new plane.
Here is my new train.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 6,
    chapter: 'UNIT 5',
    semester: '上册',
    translation: `第五单元 这是我的滑板车

一起来聊一聊
听录音，说一说。

看！这是我的滑板车。
酷！真好看。
给你。
谢谢你。我可以试试吗？
当然。给你。

一起来吟唱
这是我的滑板车。
这是我的汽车。
这是我的火车。
这是我的飞机。

一起玩一玩
找一找，说一说。

这是什么？
是滑板车。
那是什么？
是汽车。

一起来试试
听录音，选一选。

这是我的新滑板车。
这是我的新汽车。
这是我的新飞机。
这是我的新火车。`,
  },
  {
    id: 'gzb-1-1-007',
    title: "UNIT 6 I CAN JUMP",
    content: `LET'S TALK
Listen and say.

I can jump.
I can fly.
I can run.
I can walk.

Can you swim?
No, I can't.

LET'S CHANT
Jump, jump, I can jump.
Run, run, I can run.
Fly, fly, I can fly.
Walk, walk, I can walk.

LET'S PLAY
Do and say.

I can jump.
I can run.
I can fly.
I can swim.

LET'S TRY
Listen and circle.

The rabbit can jump.
The bird can fly.
The fish can swim.
The dog can run.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 7,
    chapter: 'UNIT 6',
    semester: '上册',
    translation: `第六单元 我会跳

一起来聊一聊
听录音，说一说。

我会跳。
我会飞。
我会跑。
我会走。

你会游泳吗？
不，我不会。

一起来吟唱
跳，跳，我会跳。
跑，跑，我会跑。
飞，飞，我会飞。
走，走，我会走。

一起玩一玩
做一做，说一说。

我会跳。
我会跑。
我会飞。
我会游泳。

一起来试试
听录音，圈一圈。

兔子会跳。
鸟会飞。
鱼会游泳。
狗会跑。`,
  },
  {
    id: 'gzb-1-1-008',
    title: "REVISION (II)",
    content: `REVIEW THE UNITS

I like green. It's green.
Here is my scooter.
I can jump.

Let's review and play!
Great job!`,
    type: 'revision',
    grade: '1',
    subject: '英语',
    lessonNumber: 8,
    chapter: 'REVISION',
    semester: '上册',
    translation: `复习（二）

我喜欢绿色。它是绿色的。
这是我的滑板车。
我会跳。

让我们复习和游戏吧！
太棒了！`,
  },
  {
    id: 'gzb-1-1-009',
    title: "ENGLISH NAMES",
    content: `Learn English Names

Boys' Names:
Andy, Ben, Tom, Jim, Leo, Bobby, Max, Sam, Jack, Alex

Girls' Names:
Amy, Sue, Julia, Lily, Lucy, Kate, Joy, Ann, May, Rose

Let's practice introducing ourselves!
Hello! My name is [name].
Nice to meet you!`,
    type: 'names',
    grade: '1',
    subject: '英语',
    lessonNumber: 9,
    chapter: 'ENGLISH NAMES',
    semester: '上册',
    translation: `英语名字

男孩名字：
安迪、本、汤姆、吉姆、莱奥、波比、马克斯、山姆、杰克、亚历克斯

女孩名字：
艾米、休、朱莉娅、莉莉、露西、凯特、乔伊、安、梅、罗斯

让我们练习自我介绍！
你好！我的名字是[名字]。
很高兴认识你！`,
  },
  {
    id: 'gzb-1-1-010',
    title: "VOCABULARY",
    content: `Word List

Unit 1:
hello 你好
name 名字
what's = what is 是什么
your 你的
good morning 早上好

Unit 2:
I 我
have 有
new 新的
bag 书包
book 书
ruler 尺子
pencil 铅笔
thank you 谢谢
here 这里

Unit 3:
one 一
two 二
three 三
four 四
five 五
six 六
seven 七
eight 八
nine 九
ten 十

Unit 4:
I 我
like 喜欢
green 绿色
red 红色
blue 蓝色
yellow 黄色
colour 颜色
it 它

Unit 5:
here's = here is 这是
my 我的
scooter 滑板车
car 汽车
train 火车
plane 飞机

Unit 6:
can 能
jump 跳
fly 飞
run 跑
walk 走
swim 游泳
yes 是的
no 不是`,
    type: 'vocabulary',
    grade: '1',
    subject: '英语',
    lessonNumber: 10,
    chapter: 'VOCABULARY',
    semester: '上册',
    translation: `词汇表

第一单元：
hello 你好
name 名字
what's = what is 是什么
your 你的
good morning 早上好

第二单元：
I 我
have 有
new 新的
bag 书包
book 书
ruler 尺子
pencil 铅笔
thank you 谢谢
here 这里

第三单元：
one 一
two 二
three 三
four 四
five 五
six 六
seven 七
eight 八
nine 九
ten 十

第四单元：
I 我
like 喜欢
green 绿色
red 红色
blue 蓝色
yellow 黄色
colour 颜色
it 它

第五单元：
here's = here is 这是
my 我的
scooter 滑板车
car 汽车
train 火车
plane 飞机

第六单元：
can 能
jump 跳
fly 飞
run 跑
walk 走
swim 游泳
yes 是的
no 不是`,
  },
  // ==================== 一年级下册英语 ====================
  {
    id: 'gzb-1-2-001',
    title: "UNIT 1 I'M YOUR TEACHER",
    content: `LET'S TALK
Good morning, Miss Lee.
Good morning, class.
This is my friend, Miss White.
Hi! Nice to meet you.
Nice to meet you, too.

LET'S CHANT
I'm your teacher.
I'm your friend.
We're happy.
We love school.

LET'S PLAY
Point and say.

Who's she?
She's my teacher.
Who's he?
He's my friend.

LET'S TRY
Listen and match.

This is Mr Green.
This is Miss White.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 1,
    chapter: 'UNIT 1',
    semester: '下册',
  },
  {
    id: 'gzb-1-2-002',
    title: "UNIT 2 WHAT DAY IS TODAY",
    content: `LET'S LEARN
Monday, Tuesday, Wednesday,
Thursday, Friday,
Saturday, Sunday.

What day is today?
Today is Monday.
What day is tomorrow?
Tomorrow is Tuesday.

LET'S SING
Days of the week.

Monday, Tuesday, Wednesday,
Thursday, Friday,
Saturday, Sunday.
Seven days in a week!
I love school days!

LET'S PLAY
Ask and answer.

What day is today?
Today is Wednesday.
What day is tomorrow?
Tomorrow is Thursday.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 2,
    chapter: 'UNIT 2',
    semester: '下册',
  },
  {
    id: 'gzb-1-2-003',
    title: "UNIT 3 HOW MUCH IS IT",
    content: `LET'S TALK
How much is it?
It's five yuan.
Can I have it, please?
Here you are.
Thank you.

LET'S COUNT
one yuan, two yuan, three yuan,
four yuan, five yuan, six yuan,
seven yuan, eight yuan, nine yuan,
ten yuan, twenty yuan...

LET'S PLAY
Shop and buy.

How much is this?
It's ten yuan.
I'll take it.
Here is the money.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 3,
    chapter: 'UNIT 3',
    semester: '下册',
  },
  {
    id: 'gzb-1-2-004',
    title: "UNIT 4 WHAT TIME IS IT",
    content: `LET'S LEARN
one o'clock, two o'clock,
three o'clock, four o'clock,
five o'clock, six o'clock...

What time is it?
It's seven o'clock.
It's time for school.
Let's go!

LET'S SING
What time is it?

What time is it?
It's nine o'clock.
Time for class.
Let's read together!

LET'S PLAY
Ask and answer.

What's the time?
It's three o'clock.
It's time for lunch.
Let's eat!`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 4,
    chapter: 'UNIT 4',
    semester: '下册',
  },
  {
    id: 'gzb-1-2-005',
    title: "UNIT 5 WHERE IS MY CAP",
    content: `LET'S TALK
Where is my cap?
Is it in the bag?
No, it isn't.
Is it on the desk?
Yes, it is. Thank you!

LET'S CHANT
In the bag, on the desk,
in the box, under the chair,
on the floor, near the door,
look and find, that's great!

LET'S PLAY
Hide and seek.

Where is the toy?
Is it under the bed?
No.
Is it in the box?
Yes! Found it!

LET'S TRY
Listen and circle.

The cat is in the box.
The dog is under the chair.
The bird is on the desk.
The fish is in the bowl.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 5,
    chapter: 'UNIT 5',
    semester: '下册',
  },
  {
    id: 'gzb-1-2-006',
    title: "UNIT 6 THERE IS A BIG BED",
    content: `LET'S TALK
There is a big bed in my room.
There is a desk near the window.
There is a chair beside the bed.
There is a lamp on the desk.

LET'S CHANT
In my room, there is a bed,
a desk, a chair, a lamp, a clock.
I love my room, I love my home!

LET'S PLAY
Describe and find.

There is a window in the room.
There is a picture on the wall.
There is a clock on the desk.
There is a bed in the room.

LET'S TRY
Listen and draw.

Draw a bed in the room.
Draw a desk near the window.
Draw a chair beside the bed.
Draw a lamp on the desk.`,
    type: 'dialogue',
    grade: '1',
    subject: '英语',
    lessonNumber: 6,
    chapter: 'UNIT 6',
    semester: '下册',
  },
];

export default gzbEnglishLessons;