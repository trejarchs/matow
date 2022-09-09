window.onload = function() {
    const chaptersContainer = document.querySelector('#chapters');
    for (let i = 0; i < chapters.length; i++) {
        let divChapter = document.createElement('div');
        divChapter.className = 'chapter';
        chaptersContainer.appendChild(divChapter);
        let divChTitle = document.createElement('div');
        divChTitle.className = 'ch-title';
        divChTitle.innerHTML = '<h2><a href="chapter.html?r=' + chapters[i].path + '">' + chapters[i].name + '</a></h2>';
        divChapter.appendChild(divChTitle);
        let ulChLessons = document.createElement('ul');
        ulChLessons.className = 'ch-lessons';
        divChapter.appendChild(ulChLessons);
        for (let j = 0; j < chapters[i].lessons.length; j++) {
            let liChLesson = document.createElement('li');
            liChLesson.className = 'ch-lesson';
            liChLesson.innerHTML = '<span class="number-lesson">' + parseInt(i+1) + '.' + parseInt(j+1) + '</span><a href="lesson.html?r=' + chapters[i].lessons[j].path +'">' + chapters[i].lessons[j].name + '</a>';
            ulChLessons.appendChild(liChLesson);
        };
    };

};

