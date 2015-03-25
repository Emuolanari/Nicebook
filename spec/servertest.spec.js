describe('books module', function() {
    beforeEach(function() {
        books.clear();
        books.add('{"book" : {"title":"scorpion", "description": "The life of geniuses", "author":"Steven Shaw"}}');
        books.add('{"book" : {"title":"palytime", "description": "How to have fun", "author":"Shane Brew"}}');
        books.add('{"book" : {"title":"back in malmo", "description": "Zlatan autobiography", "author":"Zlatan Ibrahimovic"}}');
        books.add('{"book" : {"title":"twilight", "description": "the life of vampires", "author":"Stephenie Meyer"}}');
        books.add('{"book" : {"title":"Gunshots", "description": "The life of horror", "author":"Zed Rodriguez"}}');
    });
    
    describe ('adding a book', function(){
        it('should be able to add a new book', function(){
            expect(books.add('{"book" : {"title": "Turin", "description": "Life in music industry", "author":"Zayn Mar"}}')).toBe(true);
            expect(books.count()).toBe(6);
            });
    
        it('should ignore books missing their title', function(){
            expect(books.add('{"book" : {"title":" ", "description": "This book sucks", "author":"Nari Ogulu"}}')).toBe(false);
            expect(books.count()).toBe(5);
            pending();
        });
        
        it('should ignore books missing description', function(){
            expect(books.add('{"book" : {"title":"back in lom", "description": " ", "author":"Zlatan Shae"}}')).toBe(false);
            expect(books.count()).toBe(5);
            pending();
        });
        
        it('should ignore books missing author', function(){
            expect(books.add('{"book" : {"title":"kul cool", "description": "Ways to get cool ", "author":" "}}')).toBe(false);
            expect(books.count()).toBe(5);
            pending();
        });
        
        it('should ignore books already in database', function(){
            expect(books.add('{"book" : {"title":"scorpion", "description": "The life of geniuses", "author":"Steven Shaw"}}')).toBe(false);
            expect(books.add('{"book" : {"title":"palytime", "description": "How to have fun", "author":"Shane Brew"}}')).toBe(false);
            expect(books.add('{"book" : {"title":"back in malmo", "description": "Zlatan autobiography", "author":"Zlatan Ibrahimovic"}}')).toBe(false);
            expect(books.add('{"book" : {"title":"twilight", "description": "the life of vampires", "author":"Stephenie Meyer"}}')).toBe(false);
            expect(books.add('{"book" : {"title":"Gunshots", "description": "The life of horror", "author":"Zed Rodriguez"}}')).toBe(false);
            expect(books.count()).toBe(5);
            pending();
        });
        it('should ignore strings not description', function(){
            expect(books.add('{"book" : {"title":"back in lom", "description": " ", "author":"Zlatan Shae"}}')).toBe(false);
            expect(books.count()).toBe(5);
            pending();
        });
        it('should require a string parameter', function(){
            expect(books.add()).toBe(false);
            expect(books.count()).toBe(5);
            pending();
        });
    });
	
});