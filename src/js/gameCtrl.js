const CONFIG = require('json!./../json/config.json');

export default class GameCtrl {
    constructor($sce) {
        /* fill partial */
        this._serveQuestion = this.__serveQuestionPartial.bind(this, $sce);
        this._getComment    = this.__getCommentPartial.bind(this, $sce);

        /* private */

        this._round   = 0;
        this._correct = null;
        this._memory  = []

        /* public */

        this.answered = false;
        this.question = null;
        this.comment  = null;

        this.next();
    }

    next() {
        if (this.question) {
            this._round++;
        }

        this.question = this._serveQuestion(CONFIG.questions[this._round]);
    }

    passAnswer(id) {
        this._memory.push(id);
        this.answered = true;
        this.comment  = this._getComment();
    }

    isSelected(id) {
        return this.answered && this._memory[this._round] === id;
    }

    isCorrect(id) {
        return this.answered && this._correct === id;
    }

    __getCommentPartial($sce) {
        return $sce.trustAsHtml(CONFIG.questions[this._round].comments[this._memory[this._round]]);
    }

    __serveQuestionPartial($sce, question) {
        this._correct = question.correct;

        return {
            text: $sce.trustAsHtml(question.text),
            answers: question.answers.map(function (a, i) {
                return {
                    id: i,
                    text: $sce.trustAsHtml(a)
                };
            })
        };
    }
}

GameCtrl.round = 0;

GameCtrl.$inject = ['$sce'];
