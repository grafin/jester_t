import { shuffle } from "./utils.js";
class Answer {
    constructor(id = 0, text = '', isCorrect = false) {
        this.id = id;
        this.text = text;
        this.isCorrect = isCorrect;
    }
    static fromObject(o) {
        let answer = new Answer();
        Object.assign(answer, o);
        return answer;
    }
}
var QuestionType;
(function (QuestionType) {
    QuestionType[QuestionType["unknow"] = 0] = "unknow";
    QuestionType[QuestionType["singlechoice"] = 1] = "singlechoice";
    QuestionType[QuestionType["multichoice"] = 2] = "multichoice";
})(QuestionType || (QuestionType = {}));
class Question {
    constructor(id = 0, type = QuestionType.unknow, text = "", answers = []) {
        this.id = id;
        this.type = type;
        this.text = text;
        this.answers = new Array();
        this.correctAnswers = new Array();
        let i = 0;
        for (let answer of answers) {
            let isCorrect = false;
            if (answer.startsWith("+")) {
                answer = answer.substring(1);
                this.correctAnswers.push(i);
                isCorrect = true;
            }
            this.answers.push(new Answer(i, answer, isCorrect));
            i += 1;
        }
        if (this.type != QuestionType.unknow && this.correctAnswers.length < 1)
            throw new Error("No correct answer provided");
        if (this.type == QuestionType.singlechoice && this.correctAnswers.length > 1)
            throw new Error("Multiple correct answers for singlechoice question");
    }
    static fromString(s) {
        let lines = s.split("\n");
        let id = Number(lines[0]);
        let type;
        switch (lines[1]) {
            case "singlechoice":
                type = QuestionType.singlechoice;
                break;
            case "multichoice":
                type = QuestionType.multichoice;
                break;
            default:
                throw new Error("Wrong question type: " + lines[1]);
        }
        let text = lines[2];
        let answers = lines.slice(3);
        return new Question(id, type, text, answers);
    }
    static fromObject(o) {
        let question = new Question();
        Object.assign(question, o);
        let answers = question.answers;
        question.answers = new Array();
        for (let ans of answers)
            question.answers.push(Answer.fromObject(ans));
        return question;
    }
    shuffle() {
        shuffle(this.answers);
    }
    ask(shuffleAnswers) {
        if (shuffleAnswers)
            this.shuffle();
        return {
            id: this.id,
            type: this.type,
            text: this.text,
            answers: this.answers.map(function (e) {
                return {
                    id: e.id,
                    text: e.text,
                    isCorrect: e.isCorrect
                };
            }),
            correctAnswers: this.correctAnswers
        };
    }
}
class Test {
    constructor(id = 0, name = "", questions = new Map()) {
        this.id = id;
        this.name = name;
        this.questions = questions;
    }
    static fromString(id, name, s) {
        let input = s.split("\n\n");
        let questions = new Map();
        for (let i of input) {
            let question = Question.fromString(i);
            questions.set(question.id, question);
        }
        return new Test(id, name, questions);
    }
    static fromObject(o) {
        let test = new Test();
        Object.assign(test, o);
        let questions = test.questions;
        test.questions = new Map();
        for (let q of questions) {
            let question = Question.fromObject(q[1]);
            test.questions.set(question.id, question);
        }
        return test;
    }
    shuffleAnswers() {
        for (let question of this.questions.values())
            question.shuffle();
    }
}
export { QuestionType, Question, Test };
