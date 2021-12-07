'use strict';

/**
 * Today we're going to write a compiler together. But not just any compiler... A
 * super duper teeny tiny compiler! A compiler that is so small that if you
 * remove all the comments this file would only be ~200 lines of actual code.
 * 今天我们一起来写一个编译器。但是不只是一个编译器。。。
 * 还是一个超级简单微型的编译器！如果把注释全去掉，
 * 大概只有200行代码的编译器
 * 
 * We're going to compile some lisp-like function calls into some C-like
 * function calls.
 * 我们将会把一些lisp-like的函数编译成一些C-like的函数
 *
 * If you are not familiar with one or the other. I'll just give you a quick intro.
 * 如果你并不熟悉lisp语言或者C语言，我可以给你简单介绍一下。
 * 
 * If we had two functions `add` and `subtract` they would be written like this:
 * 假设我们有两个函数: `add` 和 `subtract` 它们的具体写法如下：
 * 
 *                  LISP                      C
 *
 *   2 + 2          (add 2 2)                 add(2, 2)
 *   4 - 2          (subtract 4 2)            subtract(4, 2)
 *   2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
 *
 * Easy peezy right?
 * 很简单的，对吧？
 * 
 * Well good, because this is exactly what we are going to compile. While this
 * is neither a complete LISP or C syntax, it will be enough of the syntax to
 * demonstrate many of the major pieces of a modern compiler.
 * 非常好，因为这就是我们的编译器要转化的格式。不管是LISP或者C的格式，
 * 都已经足够来演示许多现代编译器的主要作用
 */

/**
 * Most compilers break down into three primary stages: Parsing, Transformation,
 * and Code Generation
 * 大多数编译器可以拆分成3个步骤：Parsing(解析)，Transformation(转化过程)和 
 * Code Generation(代码生成)
 *
 * 1. *Parsing* is taking raw code and turning it into a more abstract
 *    representation of the code.
 * 1. *Parsing*(解析)是指获取原生代码，把代码转化为一种更精要的表现形式
 *
 * 2. *Transformation* takes this abstract representation and manipulates to do
 *    whatever the compiler wants it to.
 * 2. *Transformation*(转换过程)是指把解析出来的表现形式按照编译器的规则进行操作
 *
 * 3. *Code Generation* takes the transformed representation of the code and
 *    turns it into new code.
 * 3. *Code Generation*(代码生成)获取编译完的表现形式，把表现形式转换成新的代码
 */

/**
 * Parsing(解析)
 * -------
 *
 * Parsing typically gets broken down into two phases: Lexical Analysis and
 * Syntactic Analysis.
 * 解析通常可以拆分成2个步骤：Lexical Analysis(词法分析)和
 * Syntactic Analysis (句法分析).
 *
 * 1. *Lexical Analysis* takes the raw code and splits it apart into these things
 *    called tokens by a thing called a tokenizer (or lexer).
 * 1. *Lexical Analysis*(词法分析)是指用tokenizer(分词器)或者lexer(词法分析器)
 *    把原生代码拆成tokens
 * 
 *    Tokens are an array of tiny little objects that describe an isolated piece
 *    of the syntax. They could be numbers, labels, punctuation, operators,
 *    whatever.
 *    Tokens是一组数组，里面装着一些代表部分独立格式的对象。
 *    它们可以是数字，标签，标点，操作符或者其他东西。
 *    
 *
 * 2. *Syntactic Analysis* takes the tokens and reformats them into a
 *    representation that describes each part of the syntax and their relation
 *    to one another. This is known as an intermediate representation or
 *    Abstract Syntax Tree.
 * 2. *Syntactic Analysis* (句法分析) 把tokens重新整理成语法互相关联的表达形式
 *    这也被称为intermediate representation (中间层) 或者 
 *    Abstract Syntax Tree 抽象语法树
 *
 *    An Abstract Syntax Tree, or AST for short, is a deeply nested object that
 *    represents code in a way that is both easy to work with and tells us a lot
 *    of information.
 *    Abstract Syntax Tree 抽象语法树或者简称AST，是深层嵌套的对象。
 *    用AST表达代码可以便于操作同时告诉我们很多信息
 *
 * For the following syntax:
 * 对于接下来代码的格式：
 * 
 *   (add 2 (subtract 4 2))
 * 
 * Tokens might look something like this:
 * (通过词法分析) 原代码会转化成如下的 Tokens 数组
 * 
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 *   ]
 *
 * And an Abstract Syntax Tree (AST) might look like this:
 * (通过句法分析) 代码将会转化成如下的 AST (语法树)对象
 * 
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: 
 *       [{
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }, 
 *       {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4',
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2',
 *         }]
 *       }]
 *     }]
 *   }
 */

/**
 * Transformation(转化过程)
 * --------------
 *
 * The next type of stage for a compiler is transformation. Again, this just
 * takes the AST from the last step and makes changes to it. It can manipulate
 * the AST in the same language or it can translate it into an entirely new
 * language.
 * 下一个阶段的是转化过程，就是把上一步产生的AST进行改写。
 * 这个过程可以是用相同的语言进行改写，或者把AST翻译成全新的语言。
 *
 * Let’s look at how we would transform an AST.
 * 一起来看看我们会怎么改变AST
 *
 * You might notice that our AST has elements within it that look very similar.
 * There are these objects with a type property. Each of these are known as an
 * AST Node. These nodes have defined properties on them that describe one
 * isolated part of the tree.
 * 你可能注意到了，我们的AST中有一些长得很像得元素。
 * 这些对象都有类型的属性，它们都是AST(语法树)的节点。
 * 这些节点的属性单独描述了AST(语法树)的一部分
 * 
 * We can have a node for a "NumberLiteral":
 * 我们可能会有一个名为"NumberLiteral"(数字片段)的节点
 * 
 *   {
 *     type: 'NumberLiteral',
 *     value: '2',
 *   }
 *
 * Or maybe a node for a "CallExpression":
 * 或者可能是一个名为"CallExpression"(调用语句)的节点
 *   {
 *     type: 'CallExpression',
 *     name: 'subtract',
 *     params: [...nested nodes go here...],
 *   }
 *
 * When transforming the AST we can manipulate nodes by
 * adding/removing/replacing properties, we can add new nodes, remove nodes, or
 * we could leave the existing AST alone and create an entirely new one based
 * on it.
 * 我们可以通过增加/删减/替换节点的属性来修改AST(语法树)。
 * 我们可以增加新的节点，删减节点，或者在不改变已有的AST(语法树)的情况下，
 * 根据已有的AST(语法树)创造一个全新的AST(语法树)
 *
 * Since we’re targeting a new language, we’re going to focus on creating an
 * entirely new AST that is specific to the target language.
 * 因为我们的目标是把原有的语言转化为新的语言，
 * 所以我们必须创造一整棵新语言的全新AST(语法树)
 * 
 * 
 * Traversal(遍历)
 * ---------
 *
 * In order to navigate through all of these nodes, we need to be able to
 * traverse through them. This traversal process goes to each node in the AST
 * depth-first.
 * 为了准确定位全部节点，我们需要遍历所有节点。
 * 这个过程以深度优先的规则遍历AST(语法树)的每一个节点
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2'
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4'
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2'
 *         }]
 *       }]
 *     }]
 *   }
 *
 * So for the above AST we would go:
 * 根据以上的AST(语法树)我们会遍历:
 *
 *   1. Program - Starting at the top level of the AST
 *   1. 程序 - 从在AST(语法树)的最顶层开始
 * 
 *   2. CallExpression (add) - Moving to the first element of the Program's body
 *   2. 调用语句 (add) - 移动到程序主体的第一个元素
 * 
 *   3. NumberLiteral (2) - Moving to the first element of CallExpression's params
 *   3. 数字片段 (2) - 移动到调用语句(add)的第一个参数
 * 
 *   4. CallExpression (subtract) - Moving to the second element of CallExpression's params
 *   4. 调用语句 (subtract) - 移动到调用语句(add)的第二个参数
 * 
 *   5. NumberLiteral (4) - Moving to the first element of CallExpression's params
 *   5. 数字片段 (4) - 移动到调用语句(subtract)的第一个参数
 * 
 *   6. NumberLiteral (2) - Moving to the second element of CallExpression's params
 *   6. 数字片段 (2) - 移动到调用语句(subtract)的第二个参数
 * 
 * If we were manipulating this AST directly, instead of creating a separate AST,
 * we would likely introduce all sorts of abstractions here. But just visiting
 * each node in the tree is enough for what we're trying to do.
 * 如果我们直接操作这棵AST(语法树)，而不是创造另一棵AST(语法树)，
 * 我们会在这里介绍所有有关的概念。不过单单是为了演示接下来的事情，
 * 访问AST(语法树)所有的节点已经足够了。
 * 
 * The reason I use the word "visiting" is because there is this pattern of how
 * to represent operations on elements of an object structure.
 * 我用"visiting"(访问)这个词是因为这种模式准确地表达了在一个对象的结构里如何进行操作
 * 
 * Visitors (访问器)
 * --------
 *
 * The basic idea here is that we are going to create a “visitor” object that
 * has methods that will accept different node types.
 * (关于访问器)最基本的概念如下，我们会创造一个"访问器"对象，
 * 这个对象拥有能够接收不同类型的节点的函数
 * 
 *   var visitor = {
 *     NumberLiteral() {},
 *     CallExpression() {},
 *   };
 *
 * When we traverse our AST, we will call the methods on this visitor whenever we
 * "enter" a node of a matching type.
 * 当我们遍历AST(语法树)的时候，每当我们"enter"(进入)到一个节点，
 * 我们就会调用"访问器"的相关函数
 * 
 * In order to make this useful we will also pass the node and a reference to
 * the parent node.
 * 为了让这(访问器的函数)变得有效，我们会传入相关的节点和(该节点的)父节点的参考
 *
 *   var visitor = {
 *     NumberLiteral(node, parent) {},
 *     CallExpression(node, parent) {},
 *   };
 *
 * However, there also exists the possibility of calling things on "exit". Imagine
 * our tree structure from before in list form:
 * 不过，当"exit"(离开节点)的时候，我们也希望能调用函数。
 * 用列表的形式来想象一下之前的语法树的结构
 * 
 *   - Program
 *     - CallExpression
 *       - NumberLiteral
 *       - CallExpression
 *         - NumberLiteral
 *         - NumberLiteral
 *
 * As we traverse down, we're going to reach branches with dead ends. As we
 * finish each branch of the tree we "exit" it. So going down the tree we
 * "enter" each node, and going back up we "exit".
 * 当我们遍历下去，我们会到达每个分支的尽头。
 * 当我们走完每个分支，我们会"exit"(离开)它。
 * 所以当我们(根据列表形式)往下走的时候，我们会"enter"(进入)节点。
 * 当我们回到上一层的时候，我们会"exit"(离开)节点
 *
 *   -> Program (enter)
 *     -> CallExpression (enter)
 *       -> Number Literal (enter)
 *       <- Number Literal (exit)
 *       -> Call Expression (enter)
 *          -> Number Literal (enter)
 *          <- Number Literal (exit)
 *          -> Number Literal (enter)
 *          <- Number Literal (exit)
 *       <- CallExpression (exit)
 *     <- CallExpression (exit)
 *   <- Program (exit)
 *
 * In order to support that, the final form of our visitor will look like this:
 * 为了做到(进入和离开都能接收)这种效果，最终我们的visitor(访问器)会做成下面的样子:
 * 
 *   var visitor = {
 *     NumberLiteral: {
 *       enter(node, parent) {},
 *       exit(node, parent) {},
 *     }
 *   };
 */

/**
 * Code Generation (生成代码)
 * ---------------
 *
 * The final phase of a compiler is code generation. Sometimes compilers will do
 * things that overlap with transformation, but for the most part code
 * generation just means take our AST and string-ify code back out.
 * 编译器最后的阶段是生成代码。有些编译器(在生成代码)的工作会和转化过程阶段的工作有些重合，
 * 但是大部分生成代码(的工作)是指获取AST(语法树)并将其演变回代码的形式。
 * 
 * Code generators work several different ways, some compilers will reuse the
 * tokens from earlier, others will have created a separate representation of
 * the code so that they can print node linearly, but from what I can tell most
 * will use the same AST we just created, which is what we’re going to focus on.
 * 代码生成器会以不同的方式进行工作，一些编译器会复用之前的tokens，其他的(编译器)会
 * 创建代码的另一种表达形式，所以它们(编译器)可以线性地打印节点。
 * 但是我可以告诉(你)，大部分(编译器)会重用我们刚刚创建的AST(语法树)，
 * 这也是我们接下来要做的。
 * 
 * Effectively our code generator will know how to “print” all of the different
 * node types of the AST, and it will recursively call itself to print nested
 * nodes until everything is printed into one long string of code.
 * 我们的代码生成器会弄明白怎么去"print"(打印)在AST(语法树)中所有不同类型的节点，
 * 而且它(代码生成器)会重覆地调用自己去打印嵌套的节点，
 * 直到所有节点被打印成一段很长的代码文字
 */

/**
 * And that's it! That's all the different pieces of a compiler.
 * 这就是编译器全部不同的部分。
 * 
 * Now that isn’t to say every compiler looks exactly like I described here.
 * Compilers serve many different purposes, and they might need more steps than
 * I have detailed.
 * 并不是说所有的编译器都长的像我说的一样。
 * 由于编译器服务于不同的目的，所以它们可能会比我介绍的(编译器)有更多的步骤。
 *
 * But now you should have a general high-level idea of what most compilers look
 * like.
 * 但是现在你应该对绝大部分的编译器的样子有一个概括的了解。
 *
 * Now that I’ve explained all of this, you’re all good to go write your own
 * compilers right?
 * 现在我已经解释过了，你有把握去写一个你自己的编译器，对吧？
 *
 * Just kidding, that's what I'm here to help with :P
 * 只是开个玩笑，接下来我在这里会协助你(去完成你自己的编译器的)
 * 
 * So let's begin...
 * 那么，开始吧。
 */

/**
 * ============================================================================
 *                                   (/^▽^)/
 *                                THE TOKENIZER!
 *                                    分词器
 * ============================================================================
 */

/**
 * We're gonna start off with our first phase of parsing, lexical analysis, with
 * the tokenizer.
 * 我们第一个阶段会先从分词器的解析之中的词法分析开始
 * 
 * We're just going to take our string of code and break it down into an array
 * of tokens.
 * 我们将会把我们的文字代码拆解成一个tokens数组
 *
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 */

// We start by accepting an input string of code, and we're gonna set up two
// things...
//(首先我们定义tokenizer函数，函数函数)接受1个input(作为参数)，
//然后我们将会定义2个东西。。。
function tokenizer(input) {

    // A `current` variable for tracking our position in the code like a cursor.
    // 定义一个 `current`(当前位置) 变量，用于追踪我们(遍历时)的位置，就好像光标一样。
    let current = 0;

    // And a `tokens` array for pushing our tokens to.
    // 然后定义一个 `tokens` 数组， 用于储存我们的tokens。
    let tokens = [];

    // We start by creating a `while` loop where we are setting up our `current`
    // variable to be incremented as much as we want `inside` the loop.
    // 我们创建一个`while`循环，并(在循环里面)设置我们的`current`
    // 变量，(让current变量)尽可能在(while循环)`inside`(里面)增加
    //
    // We do this because we may want to increment `current` many times within a
    // single loop because our tokens can be any length.
    // 我们这么做是由于tokens有可能是任意长度(的数组)，
    // `current`(变量)在一次循环中有可能会被多次增加，
    //
    while (current < input.length) {

        // We're also going to store the `current` character in the `input`.
        // 我们也会保存在`input`参数里`current`(当前的)字符
        let char = input[current];

        // The first thing we want to check for is an open parenthesis. This will
        // later be used for `CallExpression` but for now we only care about the
        // character.
        // 我们首先想检查开括号。这个检查在后面的`CallExpression`(调用语句)会用到
        // 但是现在我们只关心字符
        //
        // We check to see if we have an open parenthesis:
        // 我们检查一下如果字符是开括号
        if (char === '(') {

            // If we do, we push a new token with the type `paren` and set the value
            // to an open parenthesis.
            // 如果字符是开括号，我们把一个新的token放到tokens数组里，
            // 这个新的token的类型是`paren`，数值是'('
            tokens.push({
                type: 'paren',
                value: '(',
            });

            // Then we increment `current`
            // 增加我们的`current`变量
            // 移动光标
            current++;

            // And we `continue` onto the next cycle of the loop.
            // 接着我们`continue`(继续)循环里的下一个周期
            continue;
        }

        // Next we're going to check for a closing parenthesis. We do the same exact
        // thing as before: Check for a closing parenthesis, add a new token,
        // increment `current`, and `continue`.
        // 接下来我们检查闭括号，我们做同样的事情：检查一下如果字符是闭括号，
        // 把一个新的token放到tokens数组里，增加我们的`current`变量
        // `continue`(继续)循环里的下一个周期
        //
        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')',
            });
            current++;
            continue;
        }

        // Moving on, we're now going to check for whitespace. This is interesting
        // because we care that whitespace exists to separate characters, but it
        // isn't actually important for us to store as a token. We would only throw
        // it out later.
        // 接着， 我们会检查空格。这比较有趣，因为我们关心用于分隔字符的空格是否存在，
        // 但是这对于我们保存token来说不太重要。我们先放到一边。
        //
        // So here we're just going to test for existence and if it does exist we're
        // going to just `continue` on.
        // 所以我们来测试一下空格是否存在。如果存在的话，
        // 就`continue`继续(循环的下一个周期)

        let WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        // The next type of token is a number. This is different than what we have
        // seen before because a number could be any number of characters and we
        // want to capture the entire sequence of characters as one token.
        // 下一种token的类型是数字。这和我们之前看到的都不一样，因为数字可以是任意的数字字符
        // 我们希望能记录整个字符序列作为一个token.
        //
        //   (add 123 456)
        //        ^^^ ^^^
        //        Only two separate tokens
        //        (123，456)只会记录为2个tokens(而不是1，2，3，4，5，6)
        //
        // So we start this off when we encounter the first number in a sequence.
        // 所以我们由遇到整个字符序列的第一个数字开始(记录)
        let NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {

            // We're going to create a `value` string that we are going to push
            // characters to.
            // 我们创建一个`value`变量用于记录字符串
            let value = '';

            // Then we're going to loop through each character in the sequence until
            // we encounter a character that is not a number, pushing each character
            // that is a number to our `value` and incrementing `current` as we go.
            // 我们来遍历字符序列中的每一个字符，直到字符不是数字为止，
            // 把字符放进`value`变量，然后随着我们的遍历而增加`current`变量(的数值)
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }

            // After that we push our `number` token to the `tokens` array.
            // 做完上面的处理后，我们把`number` token放进`tokens`数组
            tokens.push({ type: 'number', value });

            // And we continue on.
            // 然后我们继续(循环的下一个周期)
            continue;
        }

        // We'll also add support for strings in our language which will be any
        // text surrounded by double quotes (").
        // 我们也会对在我们的语言里的字符串添加支持，
        // 而这些字符串可以是被双引号包住的任意文字 
        //
        //   (concat "foo" "bar")
        //            ^^^   ^^^ string tokens
        //
        // We'll start by checking for the opening quote:
        // 我们开始检查开始的双引号
        if (char === '"') {
            // Keep a `value` variable for building up our string token.
            // 用`value`来保存我们的字符串token
            let value = '';

            // We'll skip the opening double quote in our token.
            // 我们会跳过开始的双引号(++current)
            char = input[++current];

            // Then we'll iterate through each character until we reach another
            // double quote.
            // 接着我们会遍历每一个字符直到遍历到另一个双引号
            while (char !== '"') {
                value += char;
                char = input[++current];
            }

            // Skip the closing double quote.
            // 跳过关闭的双引号
            char = input[++current];

            // And add our `string` token to the `tokens` array.
            // 接着把我们的`string`字符串 token加到`tokens`数组
            tokens.push({ type: 'string', value });

            continue;
        }

        // The last type of token will be a `name` token. This is a sequence of
        // letters instead of numbers, that are the names of functions in our lisp
        // syntax.
        // 最后一个种类的token是`name`(名字) token。不同于数字，这是一连串的字母
        // 也是我们lisp格式的函数，
        //
        //   (add 2 4)
        //    ^^^
        //    Name token
        //    名字 token
        //
        let LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
            let value = '';

            // Again we're just going to loop through all the letters pushing them to
            // a value.
            // 再一次我遍历全部字母然后把他们放到value里。
            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }

            // And pushing that value as a token with the type `name` and continuing.
            // 接着把我们的`name`名字 token加到`tokens`数组，然后继续(循环的下一个周期)
            tokens.push({ type: 'name', value });

            continue;
        }

        // Finally if we have not matched a character by now, we're going to throw
        // an error and completely exit.
        // 如果最后我们还找不到符合的字符，我们会抛出一个错误而且完整的结束(循环)
        throw new TypeError('I dont know what this character is: ' + char);
    }

    // Then at the end of our `tokenizer` we simply return the tokens array.
    // 在我们`tokenizer`(分词器)
    return tokens;
}

/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE PARSER!!!
 *                                    解析器
 * ============================================================================
 */

/**
 * For our parser we're going to take our array of tokens and turn it into an
 * AST.
 * 对于我们的解析器，我们把tokens数组转化成AST(语法树)
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */

// Okay, so we define a `parser` function that accepts our array of `tokens`.
// 好吧，所以我们定义一个`parser`(解析器)函数。这个函数接收我们的`tokens`数组
function parser(tokens) {

    // Again we keep a `current` variable that we will use as a cursor.
    // 再一次我们保留`current`变量，用于定位当前位置就像光标一样
    let current = 0;

    // But this time we're going to use recursion instead of a `while` loop. So we
    // define a `walk` function.
    // 但是这一次，我们用自我调用(的方法)代替`while`循环。
    // 所以我们定义一个`walk`函数
    function walk() {

        // Inside the walk function we start by grabbing the `current` token.
        // 在行走函数里面，我们开始抓取`current`(目前的)token
        let token = tokens[current];

        // We're going to split each type of token off into a different code path,
        // starting off with `number` tokens.
        // 我们将会分割每一种token放进去不同的代码路径,
        // 由`number` tokens开始
        //
        // We test to see if we have a `number` token.
        // 检查当前token是否`number`(数字) token
        if (token.type === 'number') {

            // If we have one, we'll increment `current`.
            // 如果(该token)是(数字token)，我们会增加`current`(当前位置的变量)
            current++;

            // And we'll return a new AST node called `NumberLiteral` and setting its
            // value to the value of our token.
            // 然后我们会回传一个名为`NumberLiteral`(数字片段)的全新的AST(语法树)节点
            // 并且把AST节点的值设为token的值
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }

        // If we have a string we will do the same as number and create a
        // `StringLiteral` node.
        // 如果(当前检查的)节点是字符串节点，我们会重覆数字(节点)的做法，
        // 创建一个名为`StringLiteral`(文字片段)的(AST)节点
        if (token.type === 'string') {
            current++;

            return {
                type: 'StringLiteral',
                value: token.value,
            };
        }

        // Next we're going to look for CallExpressions. We start this off when we
        // encounter an open parenthesis.
        // 下一步我们会处理CallExpressions(调用语句)。我们会由开括号作为开始。
        if (
            token.type === 'paren' &&
            token.value === '('
        ) {

            // We'll increment `current` to skip the parenthesis since we don't care
            // about it in our AST.
            // 我们会先增加`current`(当前位置)来跳过括号，
            // 因为在我们的AST(语法树)里并不在乎括号
            token = tokens[++current];

            // We create a base node with the type `CallExpression`, and we're going
            // to set the name as the current token's value since the next token after
            // the open parenthesis is the name of the function.
            // 我们先创建一个种类为`CallExpression`(调用语句)的基本(AST语法树)节点，
            // 接着我们会把当前token的值,也就是函数的名字，设置为(AST语法树节点的)名字
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            };

            // We increment `current` *again* to skip the name token.
            // 我们再次增加`current`(当前位置)来跳过名字token
            token = tokens[++current];

            // And now we want to loop through each token that will be the `params` of
            // our `CallExpression` until we encounter a closing parenthesis.
            // 然后我们会遍历`CallExpression`(调用语句)的每一个`params`(参数)token
            // 直到我们遇到闭括号。
            //
            // Now this is where recursion comes in. Instead of trying to parse a
            // potentially infinitely nested set of nodes we're going to rely on
            // recursion to resolve things.
            // 现在这里会实现自我调用。我们会依靠自我调用来处理节点而不是
            // 尝试去解析一个有可能无限嵌套的节点合集
            //
            // To explain this, let's take our Lisp code. You can see that the
            // parameters of the `add` are a number and a nested `CallExpression` that
            // includes its own numbers.
            // 让我们用Lisp的代码来解释一下。你能看得到
            // `add`的参数是一个数字和一个嵌套的`CallExpression`(调用函数)，
            // 而这个`CallExpression`(调用函数)也包含着它自己的数字(参数)
            //
            //   (add 2 (subtract 4 2))
            //
            // You'll also notice that in our tokens array we have multiple closing
            // parenthesis.
            // 你可能也注意到，在我们的tokens里有多个闭括号
            // 
            //   [
            //     { type: 'paren',  value: '('        },
            //     { type: 'name',   value: 'add'      },
            //     { type: 'number', value: '2'        },
            //     { type: 'paren',  value: '('        },
            //     { type: 'name',   value: 'subtract' },
            //     { type: 'number', value: '4'        },
            //     { type: 'number', value: '2'        },
            //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
            //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
            //   ]
            //
            // We're going to rely on the nested `walk` function to increment our
            // `current` variable past any nested `CallExpression`.
            // 我们会依靠嵌套的`walk`函数通过增加`current`变量
            // 来遍历嵌套的`CallExpression`(调用语句)

            // So we create a `while` loop that will continue until it encounters a
            // token with a `type` of `'paren'` and a `value` of a closing
            // parenthesis.
            // 我们来创建一个 `while`循环，一直遍历(节点)直到遇到
            // `'paren'`(括号)`type` (类别)和`value`(值)是闭括号的节点
            while (
                (token.type !== 'paren') ||
                (token.type === 'paren' && token.value !== ')')
            ) {
                // we'll call the `walk` function which will return a `node` and we'll
                // push it into our `node.params`.
                // 我们会调用`walk`函数，把(walk函数)返回的`node`节点返进我们的
                // `node.params`(节点参数)里面
                node.params.push(walk());
                token = tokens[current];
            }

            // Finally we will increment `current` one last time to skip the closing
            // parenthesis.
            // 最终我们还会增加`current`(当前位置变量)一次来跳过闭括号
            current++;

            // And return the node.
            // 回传一个节点
            return node;
        }

        // Again, if we haven't recognized the token type by now we're going to
        // throw an error.
        // 再一次，如果我们(的程序)不能识别token的类型，我们会抛出一个错误
        throw new TypeError(token.type);
    }

    // Now, we're going to create our AST which will have a root which is a
    // `Program` node.
    // 现在，我们会创建我们的AST(语法树)，这个语法树最底层就是
    // `Program`节点
    let ast = {
        type: 'Program',
        body: [],
    };

    // And we're going to kickstart our `walk` function, pushing nodes to our
    // `ast.body` array.
    // 接着我们会启动我们的`walk`函数，把节点放到我们的
    // `ast.body`(语法树躯干的)数组里。
    //
    // The reason we are doing this inside a loop is because our program can have
    // `CallExpression` after one another instead of being nested.
    // 我们把这(启动`walk`函数)放到一个循环里面，这可以让我们的程序里把嵌套的
    // `CallExpression`(调用语句)一个接一个的处理
    //   (add 2 2)
    //   (subtract 4 2)
    //
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    // At the end of our parser we'll return the AST.
    // 最后，我们的解析器会回传AST(语法树)
    return ast;
}

/**
 * ============================================================================
 *                                 ⌒(❀>◞౪◟<❀)⌒
 *                               THE TRAVERSER!!!
 *                                    遍历器
 * ============================================================================
 */

/**
 * So now we have our AST, and we want to be able to visit different nodes with
 * a visitor. We need to be able to call the methods on the visitor whenever we
 * encounter a node with a matching type.
 * 我们现在已经有AST(语法树)了，然后我们想能够通过访问器访问不同的节点
 * 每当我们遇到符合种类的节点时，我们需要调用访问器相关的函数
 * 
 *   traverse(ast, {
 *     Program: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     CallExpression: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     NumberLiteral: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *   });
 */

// So we define a traverser function which accepts an AST and a
// visitor. Inside we're going to define two functions...
// 所以我们定义一个遍历器函数，它(遍历器)接收一个AST(语法树参数)和
// 一个访问器(参数)。在(遍历器函数)里面，我们会定义两个函数。
function traverser(ast, visitor) {

    // A `traverseArray` function that will allow us to iterate over an array and
    // call the next function that we will define: `traverseNode`.
    // `traverseArray`(遍历数组)函数。顾名思义，这个函数会遍历数组同时
    // 调用我们接下来定义的函数：`traverseNode`(遍历节点)
    function traverseArray(array, parent) {
        array.forEach(child => {
            traverseNode(child, parent);
        });
    }

    // `traverseNode` will accept a `node` and its `parent` node. So that it can
    // pass both to our visitor methods.
    // `traverseNode`(遍历节点)会接收一个`node`(节点)和该节点的`parent`(父级)节点
    // 因此，它(遍历节点函数)可以同时把它们(`node`和`parent`)作为参数传入
    // 访问器的函数
    function traverseNode(node, parent) {

        // We start by testing for the existence of a method on the visitor with a
        // matching `type`.
        // 我们来检查一下符合访问器`type`(节点类型)的函数是否存在
        let methods = visitor[node.type];

        // If there is an `enter` method for this node type we'll call it with the
        // `node` and its `parent`.
        // 如果访问器有符合节点类型的`enter`(进入)函数，我们会用`node`(节点)和它的 `parent`(父节点)
        // (作为参数)来调用它(访问器的进入函数)
        if (methods && methods.enter) {
            methods.enter(node, parent);
        }

        // Next we are going to split things up by the current node type.
        // 接下来我们会以当前节点的类别来分别处理
        switch (node.type) {

            // We'll start with our top level `Program`. Since Program nodes have a
            // property named body that has an array of nodes, we will call
            // `traverseArray` to traverse down into them.
            // 我们会从最顶层的`Program`(程序节点)开始。因为程序节点有一个叫
            // body(躯干)的节点数组，我们会调用`traverseArray`(遍历数组)
            // 去遍历它们(躯干的每一个节点)
            //
            // (Remember that `traverseArray` will in turn call `traverseNode` so  we
            // are causing the tree to be traversed recursively)
            // 还记得`traverseArray`(遍历数组函数)会反过来调用`traverseNode`(遍历节点函数)吗？
            // 我们因此会反复遍历整棵(AST)语法树
            case 'Program':
                traverseArray(node.body, node);
                break;

                // Next we do the same with `CallExpression` and traverse their `params`.
                // 接着我们对(节点类型为)`CallExpression`(调用语句的节点)做同样的事情
                // 遍历它们(调用语句的节点)的`params`(参数)
            case 'CallExpression':
                traverseArray(node.params, node);
                break;

                // In the cases of `NumberLiteral` and `StringLiteral` we don't have any
                // child nodes to visit, so we'll just break.
                // 由于`NumberLiteral`(数字片段)和`StringLiteral`(文字片段)
                // 都没有子节点需要访问，所以我们只需要跳过它们。
            case 'NumberLiteral':
            case 'StringLiteral':
                break;

                // And again, if we haven't recognized the node type then we'll throw an
                // error.
                // 再一次，如果我们(的程序)不能识别节点的类型，我们会抛出一个错误
            default:
                throw new TypeError(node.type);
        }

        // If there is an `exit` method for this node type we'll call it with the
        // `node` and its `parent`.
        // 如果访问器有符合节点类型的`exit`(离开)函数，我们(也)会用`node`(节点)和它的 `parent`(父节点)
        // (作为参数)来调用它(访问器的进入函数)
        if (methods && methods.exit) {
            methods.exit(node, parent);
        }
    }

    // Finally we kickstart the traverser by calling `traverseNode` with our ast
    // with no `parent` because the top level of the AST doesn't have a parent.
    // 最终我们会通过调用`traverseNode`(遍历节点函数)来启动遍历器
    // 把AST(语法树)作为(第一个)参数，而且因为AST(语法树)已经是最上层(的节点)
    // 所以(AST语法树)没有父级(节点)
    traverseNode(ast, null);
}

/**
 * ============================================================================
 *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
 *                              THE TRANSFORMER!!!
 *                                    转化器
 * ============================================================================
 */

/**
 * Next up, the transformer. Our transformer is going to take the AST that we
 * have built and pass it to our traverser function with a visitor and will
 * create a new ast.
 * 接下来，转换器。我们会把(刚刚)创建的AST(语法树)和访问器(作为参数)
 * 传入转化器的函数。然后(在转化器里)创建全新的AST(语法树)
 *
 * ----------------------------------------------------------------------------
 *   Original AST                     |   Transformed AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *  (sorry the other one is longer.)  |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */

// So we have our transformer function which will accept the lisp ast.
// 所以我们定义一个接收lisp ast的转化器函数
function transformer(ast) {

    // We'll create a `newAst` which like our previous AST will have a program
    // node.
    // 我们会创建一颗`newAst`(新的语法树)，就好像我们之前的AST(语法树)一样，
    // (新的语法树)也有程序节点
    let newAst = {
        type: 'Program',
        body: [],
    };

    // Next I'm going to cheat a little and create a bit of a hack. We're going to
    // use a property named `context` on our parent nodes that we're going to push
    // nodes to their parent's `context`. Normally you would have a better
    // abstraction than this, but for our purposes this keeps things simple.
    // 接下来我们会稍微作弊一下，使用一点小技巧。在父节点的`context`里存放节点。
    // 正常来说，你(的程序)会有比这更好的抽取过程，但是出于我们的目的，
    // 这可以让事情更简单。
    // 
    // Just take note that the context is a reference *from* the old ast *to* the
    // new ast.
    // 请注意，旧的AST的context是同时也是新的AST的body
    // (也就是说，我们把节点放到_context等于放到新的AST的body里)
    ast._context = newAst.body;

    // We'll start by calling the traverser function with our ast and a visitor.
    // 我们会用我们的AST和访问器来调用遍历器函数
    traverser(ast, {

        // The first visitor method accepts any `NumberLiteral`
        // 第一个访问器函数会接收任意的`NumberLiteral`(数字片段)
        NumberLiteral: {
            // We'll visit them on enter.
            // 我们会在进入的时候访问它们
            enter(node, parent) {
                // We'll create a new node also named `NumberLiteral` that we will push to
                // the parent context.
                // 我们会创建一个新的节点，也叫`NumberLiteral`(数字片段)
                // 然后把它放到父节点的context里
                parent._context.push({
                    type: 'NumberLiteral',
                    value: node.value,
                });
            },
        },

        // Next we have `StringLiteral`
        // 接着是`StringLiteral`(文字片段)
        StringLiteral: {
            enter(node, parent) {
                parent._context.push({
                    type: 'StringLiteral',
                    value: node.value,
                });
            },
        },

        // Next up, `CallExpression`.
        // 再者，是`CallExpression`(调用语句)
        CallExpression: {
            enter(node, parent) {

                // We start creating a new node `CallExpression` with a nested
                // `Identifier`.
                // 我们先创造一个新的`CallExpression`(调用语句)节点
                // 该节点包含一个嵌套的`Identifier`(识别物)
                let expression = {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: node.name,
                    },
                    arguments: [],
                };

                // Next we're going to define a new context on the original
                // `CallExpression` node that will reference the `expression`'s arguments
                // so that we can push arguments.
                // 接着我们在原来的`CallExpression`(调用语句)节点里定义一个新的context。
                // 这个context也会跟上面创造的expression(变量)的arguments保持连接
                // 用于存放(调用语句的)参数
                node._context = expression.arguments;

                // Then we're going to check if the parent node is a `CallExpression`.
                // If it is not...
                // 我们来检查一下父节点是不是`CallExpression`(调用语句)
                if (parent.type !== 'CallExpression') {

                    // We're going to wrap our `CallExpression` node with an
                    // `ExpressionStatement`. We do this because the top level
                    // `CallExpression` in JavaScript are actually statements.
                    // 我们用`ExpressionStatement`把`CallExpression`(调用语句)节点包起来
                    // 这是因为在JavaScript里最顶层的`CallExpression`的确是(有效)语句
                    expression = {
                        type: 'ExpressionStatement',
                        expression: expression,
                    };
                }

                // Last, we push our (possibly wrapped) `CallExpression` to the `parent`'s
                // `context`.
                // 最后，我们把`(有可能被包裹着的)CallExpression`(调用语句)
                // 放到父节点的`context`里
                parent._context.push(expression);
            },
        }
    });

    // At the end of our transformer function we'll return the new ast that we
    // just created.
    // 在转化器的最后，我们把新创建的AST回传出去
    return newAst;
}

/**
 * ============================================================================
 *                               ヾ(〃＾∇＾)ﾉ♪
 *                            THE CODE GENERATOR!!!!
 *                                  代码生成器
 * ============================================================================
 */

/**
 * Now let's move onto our last phase: The Code Generator.
 * 现在来到最后一个阶段：代码生成器
 *
 * Our code generator is going to recursively call itself to print each node in
 * the tree into one giant string.
 * 我们的代码生产器会重复调用自己来打印语法树的每一个节点，
 * 最后组成一段巨大的文字
 */

function codeGenerator(node) {

    // We'll break things down by the `type` of the `node`.
    // 我们以节点的种类拆解(语法树)
    switch (node.type) {

        // If we have a `Program` node. We will map through each node in the `body`
        // and run them through the code generator and join them with a newline.
        // 如果是`Program`(程序)节点。我们会把`body`的每一个节点放到代码生成器里面运行，
        // 再以新行风格符来组合它们(代码生成器的返回结果)
        case 'Program':
            return node.body.map(codeGenerator)
                .join('\n');

            // For `ExpressionStatement` we'll call the code generator on the nested
            // expression and we'll add a semicolon...
            // 对于`ExpressionStatement`(语句声明)，我们会以节点的expression作为参数
            // 再一次调用代码生成器同时在结果后面加上分号
        case 'ExpressionStatement':
            return (
                codeGenerator(node.expression) +
                ';' // << (...because we like to code the *correct* way)
                // << (...因为我们喜欢用*correct*(正确)的方式码代码)
            );

            // For `CallExpression` we will print the `callee`, add an open
            // parenthesis, we'll map through each node in the `arguments` array and run
            // them through the code generator, joining them with a comma, and then
            // we'll add a closing parenthesis.
            // 对于`CallExpression`(调用语句)我们会打印`callee`(被调用者，指函数名称)
            // 加上开括号，我们会把`arguments`的每一个节点放到代码生成器里面运行
            // 再以逗号来组合它们(代码生成器的返回结果)
            // 最后再加上闭括号
        case 'CallExpression':
            return (
                codeGenerator(node.callee) +
                '(' +
                node.arguments.map(codeGenerator)
                .join(', ') +
                ')'
            );

            // For `Identifier` we'll just return the `node`'s name.
            // 对于`Identifier`识别物，我们只需要回传`node`(节点)的名字
        case 'Identifier':
            return node.name;

            // For `NumberLiteral` we'll just return the `node`'s value.
            // 对于`NumberLiteral`(数字片段)，我们只需要回传`node`(节点)的值
        case 'NumberLiteral':
            return node.value;

            // For `StringLiteral` we'll add quotations around the `node`'s value.
            // 对于`StringLiteral`(文字片段)，我们在`node`(节点)的值的前后加上双引号
        case 'StringLiteral':
            return '"' + node.value + '"';

            // And if we haven't recognized the node, we'll throw an error.
            // 如果我们不能识别节点，我们会抛出一个错误
        default:
            throw new TypeError(node.type);
    }
}

/**
 * ============================================================================
 *                                  (۶* ‘ヮ’)۶”
 *                         !!!!!!!!THE COMPILER!!!!!!!!
 *                                  编译器
 * ============================================================================
 */

/**
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 * 最终！我们创建我们的`compiler`(编译器)函数。我们把所有部分(指函数)通过水管
 * 连接起来(水管指把回传结果传到下一个函数，一个接一个)
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */

function compiler(input) {
    let tokens = tokenizer(input);
    let ast = parser(tokens);
    let newAst = transformer(ast);
    let output = codeGenerator(newAst);

    // and simply return the output!
    // 然后简单的回传一个结果！
    return output;
}

/**
 * ============================================================================
 *                                   (๑˃̵ᴗ˂̵)و
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!YOU MADE IT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!你做到了!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * ============================================================================
 */

// Now I'm just exporting everything...
// 现在把所有东西输出出去
module.exports = {
    tokenizer,
    parser,
    traverser,
    transformer,
    codeGenerator,
    compiler,
};