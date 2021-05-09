

function testFilter(result, testing, expecting, comment) {
    if (result !== expecting) {
        console.log(result, expecting);
        console.error(`Тестирование на "${comment}" провалено. После обработки "${testing}" ожидалось "${expecting}", а вернулось "${result}".`);
    } else {
        console.log(`Тестирование на "${comment}" пройдено. После обработки "${testing}" ожидалось "${expecting}" и вернулось "${result}".`);
    }
}

testFilter(Search.methods.filter(' d'), ' d', 'd', 'удаление пробела');
testFilter(Search.methods.filter(' d: ф'), ' d', 'dф', 'удаление пробелов и двоеточия');
testFilter(Search.methods.filter('<div class="error1"></div>'), '<div class="error1"></div>', 'divclasserror1div', 'удаление всех символов кроме букв и цифр');
