/**
 * fill-content-part3.cjs — 填充剩余 90 篇
 * 六年级上册剩余 + 六年级下册 + 英语PEP 2-3年级
 * 运行: node fill-content-part3.cjs
 */
const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, 'src/data/textbooks-data.json');
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const C = {};

// ===== 六年级上册 续 =====
C['6-1-008'] = `我爱到天安门广场走走，尤其是晚上。广场上千万盏灯静静地照耀着天安门广场周围的宏伟建筑，使人心头感到光明，感到温暖。

清明节前的一个晚上，我又漫步在广场上，忽然背后传来一声赞叹："多好啊！"我心头微微一震，是什么时候听到过这句话来着？噢，对了，那是很久以前了。于是，我沉入了深深的回忆。

1947年的初秋，当时我是战地记者。一个挺年轻的通讯员，在战斗打响前，靠在一棵树的树干上，拿着一本书，正向战友们朗读。当他读到"多好啊！"这句话时，我注意到他的神情是那么专注。他叫郝副营长。

战斗打响后，我军很快攻破了敌人的防线。后续部队却因找不到突破口，被卡在了突破口外。就在这危急的时刻，郝副营长划着了火柴，点燃了那本书，为后续部队照亮了前进的路。可是，火光暴露了他自己，他被敌人的机枪打中了。

这一仗，我们消灭了敌人的一个整编师。战斗结束后，我们把郝副营长埋在茂密的沙柳丛里。这位年轻的战友，为了让孩子们能够在电灯下学习，不惜牺牲自己的生命。

在天安门前璀璨的华灯下面，我又想起这位亲爱的战友来。`;

C['6-1-009'] = `敌人控制的"391"高地，像一颗毒牙，楔入我军的阵地。我们准备在黄昏时分发动突然袭击，拔掉这颗毒牙，把战线往南推移。

那一天，天还没有亮，我们连悄悄地摸进"391"高地下面的山坳，潜伏在一条比较隐蔽的山沟里。因为敌人居高临下，当然更容易发现我们。我们趴在地上必须纹丝不动，咳嗽一声或者蜷一下腿，都可能被敌人发觉。

到了中午，敌人突然打起炮来，炮弹一排又一排，在我们附近爆炸。排炮过后，敌人竟使用了燃烧弹，我们附近的荒草着火了。火苗子呼呼地蔓延，烧得枯黄的茅草毕毕剥剥地响。我忽然闻到一股浓重的棉布焦味，一看，邱少云身上的棉衣已经着火了。

邱少云只要从火里跳出来，就地打几个滚，就可以把火扑灭。但是这样一来，我们整个班，我们身后的整个潜伏部队，都会受到重大的损失。为了整个班，为了整个潜伏部队，为了这次战斗的胜利，邱少云像千斤巨石一般，趴在火堆里一动不动。烈火在他身上烧了半个多钟头才渐渐地熄灭。这位伟大的战士，直到最后一息，也没挪动一寸地方，没发出一声呻吟。

黄昏时候，我们怀着满腔怒火，勇猛地冲上"391"高地。敌人全部被歼灭。

我永远忘不了那一天——1952年10月12日。`;

C['6-1-010'] = `我们小时候的玩具，都是自己做的，只能自己做。只要有一个人做了新鲜的玩意儿，大家看了有趣，很快就能风靡全班，以至全校。

有一段时间，我们全迷上了斗竹节人。

把毛笔杆锯成寸把长的一截，这就是竹节人的脑袋连同身躯了，在上面钻一对小眼，供装手臂用。再锯八截短的，分别当四肢。用一根纳鞋底的线把它们穿在一起，就成了。

把九个竹节人穿在一起，在下面垫一个火柴盒，就可以玩了。将线一松一紧，那竹节人就手舞之、身摆之地动起来。两个竹节人放在一起，那就是搏斗了，没头没脑地对打着，不知疲倦，也永不会倒下。

竹节人手上系上一根冰棍棒，就成了手握金箍棒的孙悟空，号称"齐天小圣"。找到两根针织机上废弃的钩针，装在竹节人手上，就成了窦尔敦的虎头双钩。用铅皮剪一把偃月刀，用铁丝系一绺红丝线做一柄蛇矛，给那竹节人装上。

破课桌，俨然一个叱咤风云的古战场。

只见老师在他自己的办公桌上，玩着刚才收去的那竹节人。双手在抽屉里扯着线，嘴里念念有词，全神贯注，忘乎所以，一点儿也没注意到我们在偷看。

他脸上的神情，跟我们玩得入迷时一模一样。`;

C['6-1-011'] = `北京故宫博物院是中国最大的古代文化艺术博物馆，位于北京市中心，天安门广场北侧。故宫旧称紫禁城，是明清两代的皇宫，也是世界上现存规模最大、保存最完整的木质结构古建筑之一。

故宫博物院占地72万平方米，建筑面积约15万平方米，有大小宫殿七十多座，房屋九千余间。四周有10米高的城墙环绕，城墙外有52米宽的护城河。故宫的四个角各有一座结构精巧的角楼。

故宫博物院主要分为前朝和内廷两大部分。前朝以太和殿、中和殿、保和殿三大殿为中心，是皇帝举行大典、召见群臣、行使权力的主要场所。内廷以乾清宫、交泰殿、坤宁宫为中心，是皇帝和后妃们居住生活的地方。

太和殿俗称金銮殿，是故宫最大的殿堂。殿高约28米，面积约2380平方米。大殿正中是一个约两米高的朱漆方台，上面安放着金漆雕龙宝座，背后是雕龙屏。

故宫博物院收藏有大量珍贵文物，据统计共达105万件之多，占全国文物总数的六分之一，其中有许多是绝无仅有的国宝。

1961年，故宫被列为第一批全国重点文物保护单位。1987年，被联合国教科文组织列入《世界遗产名录》。`;

C['6-1-012'] = `黎明的时候，雨突然大了。像泼。像倒。

山洪咆哮着，像一群受惊的野马，从山谷里狂奔而来，势不可当。

村庄惊醒了。人们翻身下床，却一脚踩进水里。东面、西面没有路。只有北面有座窄窄的木桥。

木桥前，没腿深的水里，站着他们的党支部书记，那个全村人都拥戴的老汉。

老汉清瘦的脸上淌着雨水。他不说话，盯着乱哄哄的人们。他像一座山。

老汉沙哑地喊话："桥窄！排成一队，不要挤！党员排在后边！"

水渐渐蹿上来，放肆地舔着人们的腰。

老汉突然冲上前，从队伍里揪出一个小伙子，吼道："你还算是个党员吗？排到后面去！"

木桥开始发抖，开始痛苦地呻吟。

水，爬上了老汉的胸膛。最后，只剩下了他和小伙子。

小伙子推了老汉一把，说："你先走。"

老汉吼道："少废话，快走。"他用力把小伙子推上木桥。

突然，那木桥轰的一声塌了。小伙子被洪水吞没了。

老汉似乎要喊什么，猛然间，一个浪头也吞没了他。

一片白茫茫的世界。

五天以后，洪水退了。

一个老太太，被人搀扶着，来这里祭奠。

她来祭奠两个人。

她丈夫和她儿子。`;

C['6-1-013'] = `渔夫的妻子桑娜坐在火炉旁补一张破帆。屋外寒风呼啸，汹涌澎湃的海浪拍击着海岸，溅起一阵阵浪花。海上正起着风暴，外面又黑又冷，这间渔家的小屋里却温暖而舒适。

渔夫清早驾着小船出海，这时候还没有回来。桑娜听着波涛的轰鸣和狂风的怒吼，感到心惊肉跳。

桑娜站起身来，把一块很厚的围巾包在头上，提着马灯走出门去。她想起了傍晚就想去探望的那个生病的邻居——西蒙。

桑娜敲了敲门，没有人答应。她猛地推开门。屋子里没有生炉子，又潮湿又阴冷。桑娜举起马灯，看见女邻居西蒙一动不动躺在床上——她已经死了。就在这死去的母亲旁边，睡着两个很小的孩子，卷头发，胖脸蛋，身上盖着旧衣服，睡得正香甜。

桑娜用头巾裹住睡着的孩子，把他们抱回家里。她的心跳得很厉害，自己也不知道为什么要这样做，但是觉得非这样做不可。

桑娜脸色苍白，神情激动。她忐忑不安地想："他会说什么呢？自己的五个孩子已经够他受的了……是他来啦？……不，还没来！……为什么把他们抱过来啊？……他会揍我的！那也活该，我自作自受……嗯，揍我一顿也好！"

门突然开了，魁梧黧黑的渔夫拖着湿淋淋的撕破了的渔网，一边走进来，一边说："嘿，我回来啦，桑娜！"

渔夫皱起眉，他的脸变得严肃、忧虑。"嗯，是个问题！"他搔搔后脑勺说，"嗯，你看怎么办？得把他们抱来，与死人呆在一起怎么行！哦，我们，我们总能熬过去的！快去！别等他们醒来。"

"你瞧，他们在这里啦。"桑娜拉开了帐子。`;

C['6-1-014'] = `1935年秋天，红四方面军进入草地，许多同志得了肠胃病。指导员派炊事班长照顾我们三个病号，让我们走在后面。

炊事班长快四十岁了，个子挺高，背有点儿驼，四方脸，高颧骨，脸上布满了皱纹。全连数他岁数大，对大家又特别亲，大伙都叫他"老班长"。

三个病号走不快，不到半个月，两袋青稞面吃完了。老班长到处找野菜，挖草根。一天，他在一个水塘边给我们洗衣裳，忽然看见一条鱼跳出水面。他喜出望外地取出一根缝衣针，烧红了，弯成了钓鱼钩。这天夜里，我们就吃到了鲜美的鱼汤。

可是老班长呢，我从来没见他吃过一点儿鱼。有一次，我悄悄地跟着他。走近前一看，啊！他坐在那里捧着搪瓷碗，嚼着几根草根和我们吃剩的鱼骨头。

老班长看我们一天天瘦下去，他整夜整夜地合不拢眼。每次端来鱼汤，他总是笑着让我们吃。可他的身体却越来越差了。

挨了一天又一天，渐渐接近草地的边了。这天上午，老班长又出去了，好久不见他回来。最后在一个水塘旁边找到了他，他已经昏迷不醒了。

我们急忙煮了鱼汤端到老班长面前。他微微地睁开眼睛，看见我端着的鱼汤，头一句话就说："小梁，别浪费东西了。我……我不行啦。你们吃吧！还有二十多里路，吃完了，一定要走出草地去！"

说完，老班长就牺牲了。

我把老班长留下的鱼钩小心地包起来，放在贴身的衣兜里。在这个长满了红锈的鱼钩上，闪烁着灿烂的金色的光芒！`;

C['6-1-015'] = `夏天是万物迅速生长的季节。

生物从小到大，本来是天天长的，不过夏天的长是飞快的长，跳跃的长，活生生的看得见的长。你在棚架上看瓜藤，一天可以长出几寸；你到竹子林、高粱地里听声音，在叭叭的声响里，一夜可以多出半节。昨天是苞蕾，今天是鲜花，明天就变成了小果实。

草长，树木长，山是一天一天地变丰满。稻秧长，甘蔗长，地是一天一天地高起来。水长，瀑布长，河也是一天一天地变宽变深。

北方农家的谚语说："六月六，看谷秀。"又说："处暑不出头，割谷喂老牛。"农作物到了该长的时候不长，或是长得太慢，就没有收成的希望。人也是一样，要赶时候，赶热天，尽量地用力地长。`;

C['6-1-016'] = `有一天，妈妈下班回来，送给我一个扁扁的纸盒子。我打开一看，是一件淡绿色的、透明的新雨衣。我立刻就抖开雨衣往身上穿。怎么？雨衣上竟然还长着两只袖子。不像雨衣，倒像是斗篷。

从那天起，我开始盼着下雨。每天放学路上我都在想：太阳把天烤得这样干，还能长云彩吗？为什么我一有了雨衣，天气预报就总是"晴"呢？

有一天，快到家时，路边的小杨树忽然沙啦啦地喧闹起来，就像在嘻嘻地笑。一会儿，几朵厚墩墩的云彩飘游过来，把太阳也给遮盖住了。天一下子变了脸色。果然，随着几声闷雷，头顶上真的落上了几个雨点儿。我兴奋地仰起头，甩打着书包就大步跑进了楼门。

"妈妈！"我嚷着奔进厨房，把雨衣举到妈妈面前，"你瞧，你瞧，下雨了！"

可是妈妈却说快吃饭。我穿上雨衣就往外跑。雨还在下着，雨点儿打在我的雨衣上，发出啪啪的响声。我走在雨中，感觉真高兴。`;

C['6-1-017'] = `浪淘沙（其一）
[唐] 刘禹锡
九曲黄河万里沙，
浪淘风簸自天涯。
如今直上银河去，
同到牵牛织女家。

江南春
[唐] 杜牧
千里莺啼绿映红，
水村山郭酒旗风。
南朝四百八十寺，
多少楼台烟雨中。`;

C['6-1-018'] = `据有幸飞上太空的宇航员介绍，他们在天际遨游时遥望地球，映入眼帘的是一个晶莹的球体，上面蓝色和白色的纹痕相互交错，周围裹着一层薄薄的水蓝色"纱衣"。地球，这位人类的母亲，这个生命的摇篮，是那样美丽壮观，和蔼可亲。

但是，地球又是一个半径约6400千米的星球。在群星璀璨的宇宙中，地球是渺小的，就像一叶扁舟。它只有这么大，不会再长大。

地球所拥有的自然资源也是有限的。拿矿物资源来说，它不是上帝的恩赐，而是经过几百万年，甚至几亿年的地质变化才形成的。

人类生活所需要的水资源、土地资源、生物资源等，本来是可以不断再生，长期给人类作贡献的。但是，因为人们随意毁坏自然资源，不顾后果地滥用化学品，不但使它们不能再生，还造成了一系列生态灾难。

只有一个地球，如果它被破坏了，我们别无去处。我们要精心地保护地球，保护地球的生态环境。让地球更好地造福于我们的子孙后代吧！`;

C['6-1-019'] = `伯牙鼓琴，锺子期听之。方鼓琴而志在太山，锺子期曰："善哉乎鼓琴，巍巍乎若太山。"少选之间而志在流水，锺子期又曰："善哉乎鼓琴，汤汤乎若流水。"锺子期死，伯牙破琴绝弦，终身不复鼓琴，以为世无足复为鼓琴者。`;

C['6-1-020'] = `蜀中有杜处士，好书画，所宝以百数。有戴嵩《牛》一轴，尤所爱，锦囊玉轴，常以自随。

一日曝书画，有一牧童见之，拊掌大笑，曰："此画斗牛也。牛斗，力在角，尾搐入两股间，今乃掉尾而斗，谬矣。"处士笑而然之。古语有云："耕当问奴，织当问婢。"不可改也。`;

// ===== 六年级下册 (17篇) =====
C['6-2-001'] = `照北京的老规矩，春节差不多在腊月的初旬就开始了。"腊七腊八，冻死寒鸦"，这是一年里最冷的时候。在腊八这天，家家都熬腊八粥。粥是用各种米，各种豆，与各种干果熬成的。这不是粥，而是小型的农业展览会。

除此之外，这一天还要泡腊八蒜。把蒜瓣放进醋里，封起来，为过年吃饺子用。到年底，蒜泡得色如翡翠，醋也有了些辣味，色味双美。

孩子们准备过年，第一件大事就是买杂拌儿。这是用花生、胶枣、榛子、栗子等干果与蜜饯掺和成的。第二件大事是买爆竹。恐怕第三件事才是买玩意儿——风筝、空竹、口琴等。

腊月二十三过小年，差不多就是过春节的"彩排"。天一擦黑，鞭炮响起来，便有了过年的味道。

过了二十三，大家更忙。必须大扫除一次，还要把肉、鸡、鱼、青菜、年糕什么的都预备充足。

除夕真热闹。家家赶做年菜，到处是酒肉的香味。老少男女都穿起新衣，门外贴好红红的对联，屋里贴好各色的年画。哪一家都灯火通宵，不许间断，鞭炮声日夜不绝。在外边做事的人，除非万不得已，必定赶回家来吃团圆饭。

正月初一的光景与除夕截然不同：铺户都上着板子，全城都在休息。男人们午前到亲戚家、朋友家拜年。女人们在家中接待客人。

元宵上市，春节的又一个高潮到了。正月十五，处处张灯结彩，整条大街像是办喜事，红火而美丽。有名的老铺都要挂出几百盏灯来。

一眨眼，到了残灯末庙，春节在正月十九结束了。学生该去上学，大人又去照常做事。`;

C['6-2-002'] = `初学喊爸爸的小孩子，会出门叫洋车了的大孩子，嘴巴上长了许多白胡子的老孩子，提到腊八粥，谁不是嘴里就立时生出一种甜甜的腻腻的感觉呢。把小米、饭豆、枣、栗、白糖、花生仁儿合拢来，糊糊涂涂煮成一锅，让它在锅中叹气似的沸腾着，单看它那叹气样儿，闻闻那种香味，就够咽三口以上的唾沫了，何况是，大碗大碗地装着，大匙大匙朝口里塞灌呢！

住方家大院的八儿，今天喜得快要发疯了。他一个人进进出出灶房，看到一大锅粥正在叹气，碗盏都已预备整齐，摆到灶边好久了，但他妈妈总是说时候还早。

"妈，妈，要到什么时候才……"

"要到夜里！"其实他妈所说的夜里，并不是上灯以后。但八儿听了这种松劲的话，眼睛可急红了。

锅中的一切，对八儿来说，只能猜想：栗子会已稀烂到认不清楚了吧，饭豆会煮得浑身肿胀了吧，花生仁儿吃来总已是面面的了！枣子必大了三四倍……

"呃！"他惊异得喊起来了，锅中的一切已进了他的眼中。栗子跌进锅里，不久就得粉碎，那是他知道的。饭豆煮得肿胀，那也是往常熬粥时常见的事。花生仁儿脱了他的红外套，这是不消说的事。总之，一切都成了如他所猜的样子了，但他却不曾想到今日粥的颜色是深褐。`;

C['6-2-003'] = `寒食
[唐] 韩翃
春城无处不飞花，
寒食东风御柳斜。
日暮汉宫传蜡烛，
轻烟散入五侯家。

迢迢牵牛星
迢迢牵牛星，皎皎河汉女。
纤纤擢素手，札札弄机杼。
终日不成章，泣涕零如雨。
河汉清且浅，相去复几许。
盈盈一水间，脉脉不得语。

十五夜望月
[唐] 王建
中庭地白树栖鸦，
冷露无声湿桂花。
今夜月明人尽望，
不知秋思在谁家。`;

C['6-2-004'] = `世界上还有几个剧种是戴着面具演出的呢？世界上还有几个剧种在演出时是没有舞台的呢？世界上还有几个剧种一部戏可以演出三五天还没有结束的呢？

还是从西藏的臧戏说起吧。

臧戏是西藏地区特有的剧种。它的起源，可以追溯到六百多年前。那时候，西藏历史上出现了一位传奇人物——唐东杰布。他为了在雅鲁藏布江上架设铁索桥，组织了一个戏班子，通过表演募捐资金。这个戏班子就是臧戏的雏形。

臧戏的表演非常独特。演员们戴着各式各样的面具，有的面具是白色的，代表善良；有的是红色的，代表威严；还有的是黑色的，代表凶恶。臧戏的舞台极其简单，也许就是一个广场，也许就是一片空地。

臧戏的唱腔高亢嘹亮，回荡在雪山之间。伴奏的乐器也很简单，只有一鼓一钹。

几百年来，臧戏一直流传在西藏的民间。每逢节日，人们就会聚集在一起，观看臧戏表演。如今，臧戏已经成为西藏文化的瑰宝，被列入国家级非物质文化遗产名录。`;

C['6-2-005'] = `从前有一个叫鲁滨逊的英国人，他喜欢航海和冒险，到过世界上很多地方，碰到过许多危险，但他一点儿也不畏惧，希望走遍天涯海角。

有一次，鲁滨逊乘船前往非洲，途中遇上大风，船被吹到了荒岛附近。船上的人们都葬身大海，只有鲁滨逊一个人被海浪冲到了这个荒无人烟的海岛上。

鲁滨逊把船上可以搬走的东西都搬到岛上，用船上的帆布搭了一个帐篷，把东西都放在帐篷里。他还用削尖的木桩围了一个栅栏，防止野兽的袭击。

在岛上，鲁滨逊遇到了许多困难。他没有食物，就去打猎、捕鱼。他还学会了种植农作物，收获了小麦和水稻。他学会了制作陶器，用陶罐储存食物。他还驯养了一群山羊，每天喝羊奶、吃羊肉。

就这样，鲁滨逊在荒岛上生活了二十八年。他凭着自己的智慧和勇气，战胜了种种困难，终于回到了英国。`;

C['6-2-006'] = `从前有一个男孩，大约十四岁，身体很单薄，是个瘦高个儿。他贪吃贪睡，不爱干活，十分顽皮。一个星期日的早晨，这个男孩的父母要到教堂去。男孩坐在桌子边上，正在想心事。

突然，他听到一种很细小的声音。他抬起头，看见一只小精灵坐在柜子上。他生气极了，一把抓住小精灵。小精灵挣扎着，说："放了我，我会给你一枚金币。"

尼尔斯放了小精灵，但小精灵并没有给他金币。他气坏了，正要再去抓小精灵，却发现自己变成了一个很小很小的人——只有拇指那么大。

他走出屋子，想去寻找小精灵，让他把自己变回来。这时，他听见母鸡和大公鸡在说话，他居然能听懂它们的话了！原来，他不仅变小了，还获得了和动物说话的能力。

从此，尼尔斯开始了他的奇妙旅行。他骑在一只家鹅的背上，跟着一群大雁周游了瑞典的许多地方。在旅途中，他经历了许多惊险的事，也学到了很多东西。他变得勇敢、善良、勤劳了。当他回到家时，已经是一个好孩子了。`;

C['6-2-007'] = `汤姆·索亚是美国作家马克·吐温笔下的人物。他是一个聪明活泼、富有正义感的小男孩，但他也十分顽皮，常常做出一些令人啼笑皆非的事情。

故事发生在美国密西西比河畔的一个小镇上。汤姆和她的姨妈波莉住在一起。

有一次，汤姆因为淘气被波莉姨妈罚刷围墙。他不想干活，就想出了一个鬼主意。他装作很享受的样子，一边刷墙一边哼着歌。他的好朋友本·罗杰斯路过，看见汤姆刷得那么开心，就用自己手里的苹果跟汤姆交换了刷墙的机会。汤姆坐在阴凉处，一边吃着苹果，一边看着本干活，心里得意极了。

还有一次，汤姆和好朋友哈克贝利·费恩去墓地探险，无意中目睹了一桩凶杀案。在法庭上，汤姆最终鼓足勇气，指认了真正的凶手——印第安人乔。汤姆因此成了小镇上的英雄。

后来，汤姆和哈克在一个山洞里发现了印第安人乔的藏宝地。经过一番惊险的追踪，他们终于找到了宝藏，获得了巨额财富。`;

C['6-2-008'] = `燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？——是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢：现在又到了哪里呢？

我不知道他们给了我多少日子；但我的手确乎是渐渐空虚了。在默默里算着，八千多日子已经从我手中溜去；像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。

去的尽管去了，来的尽管来着；去来的中间，又怎样地匆匆呢？早上我起来的时候，小屋里射进两三方斜斜的太阳。太阳他有脚啊，轻轻悄悄地挪移了；我也茫茫然跟着旋转。于是——洗手的时候，日子从水盆里过去；吃饭的时候，日子从饭碗里过去；默默时，便从凝然的双眼前过去。我觉察他去的匆匆了，伸出手遮挽时，他又从遮挽着的手边过去，天黑时，我躺在床上，他便伶伶俐俐地从我身上跨过，从我脚边飞去了。等我睁开眼和太阳再见，这算又溜走了一日。我掩着面叹息。但是新来的日子的影儿又开始在叹息里闪过了。

在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？只有徘徊罢了，只有匆匆罢了；在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了；我留着些什么痕迹呢？我何曾留着像游丝样的痕迹呢？我赤裸裸来到这世界，转眼间也将赤裸裸的回去罢？但不能平的，为什么偏要白白走这一遭啊？

你聪明的，告诉我，我们的日子为什么一去不复返呢？`;

C['6-2-009'] = `我还记得我的第一次盼望。那是一个星期天，从早晨到下午，一直到天色昏暗下去。

那个星期天母亲答应带我出去，去哪儿已经记不清了，可能是动物园，也可能是别的什么地方。总之她很久之前就答应了，就在那个星期天带我出去玩，这不会错。而且就在那天早晨，母亲也还是这样答应的：去，当然去。

起床，刷牙，吃饭，那是个春天的早晨，阳光明媚。走吗？等一会儿，等一会儿再走。我跑出去，站在街门口，等一会儿就等一会儿。

我蹲在母亲身边，看着她洗衣服。我一声不吭，盼着。我看着盆里的衣服和盆外的衣服，我看着太阳，看着光线。我一声不吭，看着盆里揉动的衣服和绽开的泡沫，我感觉到周围的光线渐渐地暗下去，渐渐地凉下去沉郁下去，越来越远越来越缥缈。那个星期天。就在那天。

光线正无可挽回地消逝，一派荒凉。`;

C['6-2-010'] = `马诗
[唐] 李贺
大漠沙如雪，
燕山月似钩。
何当金络脑，
快走踏清秋。

石灰吟
[明] 于谦
千锤万凿出深山，
烈火焚烧若等闲。
粉骨碎身浑不怕，
要留清白在人间。

竹石
[清] 郑燮
咬定青山不放松，
立根原在破岩中。
千磨万击还坚劲，
任尔东西南北风。`;

C['6-2-011'] = `1927年4月28日，我永远忘不了那一天。那是父亲的被难日，离现在已经十六年了。

那年春天，父亲每天夜里回来得很晚。每天早晨，不知道什么时候他又出去了。有时候他留在家里，埋头整理书籍和文件。我蹲在旁边，看他把书和有字的纸片投到火炉里去。

我奇怪地问他："爹，为什么要烧掉呢？怪可惜的。"

待了一会儿，父亲才回答："不要了就烧掉。你小孩子家知道什么！"

后来听母亲说，军阀张作霖要派人来检查。为了避免党组织被破坏，父亲只好把一些书籍和文件烧掉。才过了两天，果然出事了。

4月6日的早晨，我正在外间看报。忽然听见啪，啪……几声尖锐的枪声，接着是一阵纷乱的喊叫。

父亲不慌不忙地向外走去。我紧跟在他身后，走出院子，暂时躲在一间僻静的小屋里。

一会儿，外面传来一阵沉重而杂乱的脚步声。我的心剧烈地跳动起来，用恐怖的眼光瞅了瞅父亲。

"不要怕，一切跟我来！"父亲说。`;

C['6-2-012'] = `我们的共产党和共产党所领导的八路军、新四军，是革命的队伍。我们这个队伍完全是为着解放人民的，是彻底地为人民的利益工作的。张思德同志就是我们这个队伍中的一个同志。

人总是要死的，但死的意义有不同。中国古时候有个文学家叫做司马迁的说过："人固有一死，或重于泰山，或轻于鸿毛。"为人民利益而死，就比泰山还重；替法西斯卖力，替剥削人民和压迫人民的人去死，就比鸿毛还轻。张思德同志是为人民利益而死的，他的死是比泰山还要重的。

因为我们是为人民服务的，所以，我们如果有缺点，就不怕别人批评指出。不管是什么人，谁向我们指出都行。只要你说得对，我们就改正。你说的办法对人民有好处，我们就照你的办。

我们都是来自五湖四海，为了一个共同的革命目标，走到一起来了。我们的同志在困难的时候，要看到成绩，要看到光明，要提高我们的勇气。要奋斗就会有牺牲，死人的事是经常发生的。但是我们想到人民的利益，想到大多数人民的痛苦，我们为人民而死，就是死得其所。`;

C['6-2-013'] = `1948年5月25日，解放隆化的战斗打响了。战士们像潮水一般冲向敌军司令部所在地——隆化中学。嗒嗒嗒……从一座桥上突然喷出几条火舌，封锁了我军前进的道路。那座桥是暗堡，敌人的机枪就是从那里面射出来的。

董存瑞抱起炸药包，跃出战壕，冲了上去。他夹紧炸药包，一会儿忽左忽右地匍匐前进，一会儿又向前滚了好几米。突然，他身子一震，左腿中了一枪。这时，他离暗堡只有几十米了。

董存瑞猛冲到桥下。桥离地面有一人多高，炸药包无处安放。他把炸药包放在桥沿上，可两下都滑了下来。要是把炸药包放在河床上，又炸不着暗堡。他四下看了看，找不到任何东西来代替支架。

危急关头，他毫不犹豫地用左手托起炸药包，右手拉燃导火索，高喊："同志们，为了新中国，冲啊！"

只听一声巨响，敌人的暗堡被炸毁了。董存瑞用自己年轻的生命，为部队开辟了前进的道路。`;

C['6-2-014'] = `学弈

弈秋，通国之善弈者也。使弈秋诲二人弈，其一人专心致志，惟弈秋之为听；一人虽听之，一心以为有鸿鹄将至，思援弓缴而射之。虽与之俱学，弗若之矣。为是其智弗若与？曰：非然也。

两小儿辩日

孔子东游，见两小儿辩斗，问其故。

一儿曰："我以日始出时去人近，而日中时远也。"

一儿曰："我以日初出远，而日中时近也。"

一儿曰："日初出大如车盖，及日中则如盘盂，此不为远者小而近者大乎？"

一儿曰："日初出沧沧凉凉，及其日中如探汤，此不为近者热而远者凉乎？"

孔子不能决也。

两小儿笑曰："孰为汝多知乎？"`;

C['6-2-015'] = `有人说过这样一句话：真理诞生于一百个问号之后。其实，这句话本身就是一个真理。

纵观千百年来的科学技术发展史，那些定理、定律、学说的发现者、创立者，差不多都很善于从细小的、司空见惯的自然现象中看出问题，追根求源，终于把"？"拉直变成"！"，找到了真理。

就拿洗澡来说，是一件非常普通的事情。美国麻省理工学院机械工程系的系主任谢皮罗教授，却敏锐地注意到：每次放掉洗澡水时，水的漩涡总是朝逆时针方向旋转的。这是为什么呢？谢皮罗紧紧抓住这个问号不放，进行了反复的实验和研究。1962年，他发表了论文，认为这种漩涡与地球的自转有关。

无独有偶。17世纪的一个夏天，英国著名化学家波义耳正急匆匆地向自己的实验室走去，匆忙中，他把一滴盐酸溅到了紫罗兰上。过了一会儿，紫罗兰的颜色变成了红色。波义耳敏感地意识到，紫罗兰中有一种成分，遇酸会变成红色。他立即动手，用多种酸进行实验，结果都证明是相同的。由此，波义耳制成了实验中常用的酸碱试纸——石蕊试纸。

在科学史上，这样的事例还有很多。它说明科学并不神秘，真理并不遥远。只要你见微知著，善于发问并不断探索，那么，当你解答了若干个问号之后，就能发现真理。`;

C['6-2-016'] = `我小时候住在一座小城里，城里没有工厂，所以也没有机器的声音。我那时以为凡能发出声音的，都是活的生物。早晨有鸟叫得很好听，夜里有狗吠得很怕人，夏天蝉在绿树上叫，秋晚有各种的虫在草丛中唱。可是，父亲怀里的表，它发出的声音，可不是活的。它秒针的走动，滴答滴答……

可是，我对于它的好奇心一天比一天增加。父亲有一天忽然对我说："这表里有一个小蝎子，一到夜里就出来，一出来，就滴答滴答地响……"

我吓了一跳，蝎子是多么丑恶而恐怖的东西，为什么把它放在这样一个美丽的世界里呢？但是我也感到愉快，证实我的猜测没有错：表里边有一个活的生物。

后来我见人就说："我有蟋蟀在钵子里，蝈蝈在葫芦里，鸟儿在笼子里；父亲却有一个小蝎子在表里。"

这样的话我不知说了多久，也不知道到什么时候才不说了。`;

C['6-2-017'] = `2155年的一天，托米发现了一本真正的书——那是一本用纸做的书。他把这本书带到了学校，给他的好朋友玛琪看。

"这是什么？"玛琪问。

"这是一本书。"托米说，"这是一本真正的书。它是在很久很久以前的古时候写的。"

"那它里面写的是什么？"

"关于学校的事。"

"学校？"玛琪很奇怪，"学校有什么好写的？"

"他们那时候有一本一本真正的书，"托米说，"他们还有老师。所有的孩子都到一个叫学校的地方去上课。"

"为什么要到学校去呢？"玛琪问，"在家学习不是更好吗？"

"可是，他们那时候没有电视机，也没有电脑。他们只能去学校。"

玛琪想象不出那样的生活。在她的时代，每个孩子都在家里通过电视和电脑学习。他们的老师是一个机器人，会根据每个孩子的学习进度来调整课程。

玛琪觉得那本古书里的学校生活很可笑：所有的孩子都在同一个时间学习同样的东西，老师是一个真正的人，还会给孩子们布置作业和考试。

"他们那时候一定过得很不开心。"玛琪想。`;

// ============ PEP English ============
// 2年级上册 = PEP 三年级起点 上册
C['pep-2-1-001'] = "Unit 1 Hello!\n\nLet's Talk:\nMiss White: Hello, I'm Miss White.\nMike: Hello, I'm Mike.\nSarah: Hi, I'm Sarah.\nWu Yifan: Hello, I'm Wu Yifan.\n\nLet's Learn:\nruler, pencil, eraser, crayon, bag, pen, pencil box, book\n\nLet's Chant:\nHello, hello, hello, hello!\nHello, hello, what's your name?\nMy name is Mike. My name is Mike.\nHello, hello, hello, hello!";

C['pep-2-1-002'] = "Unit 2 Colours\n\nLet's Talk:\nMr Jones: Good morning.\nMike: Good morning, Mr Jones.\nSarah: I see red.\nMike: I see green.\n\nLet's Learn:\nred, yellow, blue, green, white, black, orange, brown\n\nLet's Chant:\nRed, red, I see red.\nYellow, yellow, I see yellow.\nBlue, blue, I see blue.\nColours, colours everywhere!";

C['pep-2-1-003'] = "Unit 3 Look at Me!\n\nLet's Talk:\nMike: Good afternoon.\nWu Yifan: Good afternoon.\nMike: Look at me! This is my face.\nWu Yifan: This is my nose.\n\nLet's Learn:\nface, ear, eye, nose, mouth, arm, hand, head, body, leg, foot\n\nLet's Chant:\nLook at me! Look at me!\nThis is my head, this is my nose.\nLook at me! Look at me!\nThese are my eyes, these are my ears.";

C['pep-2-1-004'] = "Unit 4 We Love Animals\n\nLet's Talk:\nMike: Look! A duck.\nSarah: I have a dog.\nMike: I have a cat.\n\nLet's Learn:\nduck, pig, cat, bear, dog, elephant, monkey, bird, tiger, panda, zoo\n\nLet's Chant:\nI have a cat. Meow, meow.\nI have a dog. Woof, woof.\nI have a duck. Quack, quack.\nWe love animals!";

C['pep-2-1-005'] = "Unit 5 Let's Eat!\n\nLet's Talk:\nMum: I'd like some bread, please.\nMike: Here you are.\nMum: Thank you.\nMike: You're welcome.\n\nLet's Learn:\nbread, juice, egg, milk, water, cake, fish, rice\n\nLet's Chant:\nI'd like some bread.\nI'd like some milk.\nI'd like some cake.\nYum, yum, yum!";

C['pep-2-1-006'] = "Unit 6 Happy Birthday!\n\nLet's Talk:\nMike: This one, please.\nShop worker: Sure. How many plates?\nMike: Five.\nShop worker: Here you are.\n\nLet's Learn:\none, two, three, four, five, six, seven, eight, nine, ten\n\nLet's Chant:\nHappy birthday to you!\nHappy birthday to you!\nHow old are you?\nI am six years old.";

// 2年级下册
C['pep-2-2-001'] = "Unit 1 Welcome Back to School!\n\nLet's Talk:\nMiss White: Welcome back! Nice to see you again.\nStudents: Nice to see you, too.\nAmy: Hi, I'm Amy. I'm from the UK.\n\nLet's Learn:\nUK, Canada, USA, China, student, pupil, he, she, teacher\n\nLet's Chant:\nWelcome back, welcome back!\nNice to see you again!\nWe are friends, we are happy!\nWelcome back to school!";

C['pep-2-2-002'] = "Unit 2 My Family\n\nLet's Talk:\nAmy: Who's that man?\nMike: He's my father.\nAmy: Who's that woman?\nMike: She's my mother.\n\nLet's Learn:\nfather, mother, brother, sister, grandmother, grandfather, family\n\nLet's Chant:\nI love my father. I love my mother.\nI love my brother and my sister.\nWe are a happy family!";

C['pep-2-2-003'] = "Unit 3 At the Zoo\n\nLet's Talk:\nAmy: Look at the elephant!\nMike: It's so big!\nAmy: Look at the bird!\nMike: It's so small!\n\nLet's Learn:\nbig, small, long, short, tall, fat, thin\n\nLet's Chant:\nBig, big, big! The elephant is big.\nSmall, small, small! The bird is small.\nTall, tall, tall! The giraffe is tall.\nShort, short, short! The cat is short.";

C['pep-2-2-004'] = "Unit 4 Where Is My Car?\n\nLet's Talk:\nMum: Let's go home!\nMike: OK!\nMum: Where is my bag?\nMike: It's on the desk.\n\nLet's Learn:\non, in, under, chair, desk, cap, ball, car, boat, map\n\nLet's Chant:\nWhere is my cap? Where is my cap?\nIt's on the desk. It's on the desk.\nWhere is my ball? Where is my ball?\nIt's under the chair.";

C['pep-2-2-005'] = "Unit 5 Do You Like Pears?\n\nLet's Talk:\nSarah: Do you like pears?\nMike: Yes, I do.\nSarah: Do you like oranges?\nMike: No, I don't. I like apples.\n\nLet's Learn:\npear, apple, orange, banana, grape, strawberry\n\nLet's Chant:\nDo you like pears? Yes, I do.\nDo you like apples? Yes, I do.\nDo you like oranges? No, I don't.\nI like bananas! Yum!";

C['pep-2-2-006'] = "Unit 6 How Many?\n\nLet's Talk:\nAmy: How many birds do you see?\nMike: I see 12.\nAmy: How many cats do you see?\nMike: I see 20.\n\nLet's Learn:\neleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty\n\nLet's Chant:\nHow many? How many?\nI see 11 birds in the tree.\nHow many? How many?\nI see 20 cats, look at me!";

// 3年级上册 - PEP提升版
C['pep-3-1-001'] = "Unit 1 Hello! (Extended)\n\nLet's Talk:\nMiss White: Good morning, class.\nClass: Good morning, Miss White.\nMike: Hello, I'm Mike. What's your name?\nSarah: My name's Sarah.\n\nLet's Learn:\nschoolbag, textbook, notebook, storybook, pen, pencil, ruler, eraser\n\nRead and Write:\nI have a new schoolbag. It's blue. I have a pen, a pencil, and a ruler. I like my schoolbag.";

C['pep-3-1-002'] = "Unit 2 Colours (Extended)\n\nLet's Talk:\nMr Jones: Good morning, class.\nClass: Good morning, Mr Jones.\nMiss Green: Good afternoon.\nStudents: Good afternoon, Miss Green.\n\nLet's Learn:\nred, yellow, blue, green, white, black, orange, brown, purple, pink\n\nRead and Write:\nI like colours. I have a red pen and a yellow pencil. My schoolbag is blue. My ruler is green.";

C['pep-3-1-003'] = "Unit 3 Look at Me! (Extended)\n\nLet's Talk:\nMike: Look at me! This is my head.\nSarah: This is my body.\nMike: Let's make a puppet!\nSarah: Great!\n\nLet's Learn:\nhead, hair, face, nose, mouth, eye, ear, arm, hand, leg, foot, body\n\nRead and Write:\nLook at me! I have a big head. I have two eyes and two ears. I have one nose and one mouth.";

C['pep-3-1-004'] = "Unit 4 We Love Animals (Extended)\n\nLet's Talk:\nMike: Look at the cat!\nSarah: It's fat.\nMike: Look at the pig!\nSarah: It's big.\n\nLet's Learn:\ncat, dog, pig, duck, bear, elephant, monkey, bird, tiger, panda, rabbit, mouse\n\nRead and Write:\nI like animals. I have a cat. It's white. It has big eyes and a small nose. It likes fish.";

C['pep-3-1-005'] = "Unit 5 Let's Eat! (Extended)\n\nLet's Talk:\nMike: I'm hungry.\nSarah: Have some bread.\nMike: Thanks. I'd like some milk, too.\nSarah: Here you are.\n\nLet's Learn:\nbread, juice, egg, milk, water, cake, fish, rice, noodles, chicken\n\nRead and Write:\nI like food. I'd like some bread and milk for breakfast. I'd like some rice and fish for lunch.";

C['pep-3-1-006'] = "Unit 6 Happy Birthday! (Extended)\n\nLet's Talk:\nMike: How old are you?\nSarah: I'm eight years old.\nMike: Happy birthday!\nSarah: Thank you!\n\nLet's Learn:\none, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve\n\nRead and Write:\nToday is my birthday. I'm nine years old. I have a birthday cake. I'm very happy!";

// 3年级下册
C['pep-3-2-001'] = "Unit 1 Welcome Back to School! (Extended)\n\nLet's Talk:\nMiss White: Welcome back! Nice to see you again.\nStudents: Nice to see you, too.\nAmy: Hi, I'm Amy. I'm from the UK.\nMike: Hi, I'm Mike. I'm from Canada.\n\nLet's Learn:\nUK, Canada, USA, China, Australia, student, pupil, teacher\n\nRead and Write:\nHello! My name is Amy. I'm from the UK. I'm a pupil. I like reading. I have many friends at school.";

C['pep-3-2-002'] = "Unit 2 My Family (Extended)\n\nLet's Talk:\nAmy: Who's that man?\nMike: He's my father.\nAmy: Is he your brother?\nMike: Yes, he is.\n\nLet's Learn:\nfather, mother, brother, sister, grandfather, grandmother, uncle, aunt, cousin\n\nRead and Write:\nThis is my family. My father is tall. My mother is nice. My brother is funny. My sister is cute. I love my family!";

C['pep-3-2-003'] = "Unit 3 At the Zoo (Extended)\n\nLet's Talk:\nAmy: Look at the elephant!\nMike: Wow! It's so big!\nAmy: Look at the monkey!\nMike: It's so cute! It has a long tail.\n\nLet's Learn:\nbig, small, long, short, tall, fat, thin, beautiful, cute, funny\n\nRead and Write:\nLet's go to the zoo! I see a big elephant. It has big ears and a long nose. I see a small monkey.";

C['pep-3-2-004'] = "Unit 4 Where Is My Car? (Extended)\n\nLet's Talk:\nMum: Where is my bag?\nMike: Is it on the desk?\nMum: No, it isn't.\nMike: Is it under the chair?\nMum: Yes, it is! Thank you.\n\nLet's Learn:\non, in, under, behind, next to, chair, desk, box, room\n\nRead and Write:\nMy room is messy. Where is my cap? It's on the desk. Where is my ball? It's under the chair.";

C['pep-3-2-005'] = "Unit 5 Do You Like Pears? (Extended)\n\nLet's Talk:\nMum: Do you like pears?\nMike: Yes, I do.\nMum: Do you like oranges?\nMike: No, I don't. I like apples.\n\nLet's Learn:\npear, apple, orange, banana, grape, watermelon, strawberry, fruit\n\nRead and Write:\nI like fruit. I like apples and pears. I don't like grapes. My mother likes oranges. Fruit is healthy!";

C['pep-3-2-006'] = "Unit 6 How Many? (Extended)\n\nLet's Talk:\nAmy: How many cars do you have?\nMike: I have 15.\nAmy: How many books do you have?\nMike: I have 20.\n\nLet's Learn:\nthirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, twenty-one\n\nRead and Write:\nI have many things. I have 15 cars. I have 20 books. I have 12 pencils. I like to count!";

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
