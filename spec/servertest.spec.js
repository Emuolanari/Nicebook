describe('books module', function() {
    beforeEach(function() {
        books.clear();
        books.add('{"book" : {"title":"back in malom", "description": "This book sucks", "author":"Zlatan Ibrahimovic"}}');
        books.add('second book');
        books.add('third book');
        books.add('fourth book');
        books.add('fifth book');
    });
    
    describe ('adding a book', function(){
        it('should be able to add a new book', function(){
            expect(books.add('sixth book')).toBe(true);
            expect(books.count()).toBe(6);
            })
    
        it('should ignore books missing title', function(){
            expect(books.add('')).toBe(false);
            expect(books.count()).toBe(5);
        });
        it('should ignore books missing description', function(){
            expect(books.add('   ')).toBe(false);
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