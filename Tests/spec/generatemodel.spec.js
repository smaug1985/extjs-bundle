describe('Model Generator', function () {
    it('Person Model exist', function () {
        expect(Test.model.Person).toBeDefined();
    });
    it('Base Book Model to exist', function() {
        expect(Test.model.BaseBook).toBeDefined();
    });
    it('Book Model to exist', function() {
        expect(Test.model.Book).toBeDefined();
    });
    describe('Model Fields', function () {
        var getField = (function () {
            var fields = Test.model.Person.getFields();
            var list = {};
            for (var i = 0; i < fields.length; i++) {
                list[fields[i].name] = fields[i];
            }
            return function (name) {
                return list[name];
            }
        })();
        it('contain 9 fields', function () {
            expect(Test.model.Person.getFields().length).toBe(9);
        });
        it('age field', function () {
            expect(getField('age').type).toBe(Ext.data.Types.INT);
        });
        it('active field', function () {
            expect(getField('active').type).toBe(Ext.data.Types.BOOLEAN);
        });
        it('createdAt field', function () {
            expect(getField('createdAt').type).toBe(Ext.data.Types.DATE);
        });
        it('email field', function () {
            expect(getField('email').type).toBe(Ext.data.Types.STRING);
        });
        it('exclude dob field', function() {
            expect(getField('dob')).toBeUndefined();
        });
    });
    describe('Model Validations', function() {
        it('Presence Failed', function() {
            var p = Ext.create('Test.model.Person');
            p.set("firstName", "");
            var errors = p.validate();
            expect(errors.getByField("firstName").length).toBe(1);
        });
        it('Presence Success', function() {
            var p = Ext.create('Test.model.Person');
            p.set("lastName", "test");
            var errors = p.validate();
            expect(errors.getByField("lastName").length).toBe(0);
        });
        it('Length Failed', function() {
            var p = Ext.create('Test.model.Person');
            p.set("email", "as@ad.com");
            var errors = p.validate();
            expect(errors.getByField("email").length).toBe(1);
            p.set("email", "asdqwezxv@asdqwe.com.au");
            errors = p.validate();
            expect(errors.getByField("email").length).toBe(1);
        });
        it('Length Success', function() {
            var p = Ext.create('Test.model.Person');
            p.set("email", "as@ad.com.au");
            var errors = p.validate();
            expect(errors.getByField("email").length).toBe(0);
        });
        it('Email Failed', function() {
            var p = Ext.create('Test.model.Person');
            p.set("email", "as.ad.coma1.au");
            var errors = p.validate();
            expect(errors.getByField("email").length).toBe(1);
        });
        it('Email Success', function() {
            var p = Ext.create('Test.model.Person');
            p.set("email", "as@adas.com.au");
            var errors = p.validate();
            expect(errors.getByField("email").length).toBe(0);
        });
        it('Regex Success', function() {
            var p = Ext.create('Test.model.Person');
            p.set("regex", "81 4");
            var errors = p.validate();
            expect(errors.getByField("regex").length).toBe(0);
        });
        it('Regex Failed', function() {
            var p = Ext.create('Test.model.Person');
            p.set("regex", "a1 4");
            var errors = p.validate();
            expect(errors.getByField("regex").length).toBe(1);
        });
        it('Choice Success', function() {
            var p = Ext.create('Test.model.Person');
            p.set("color", "red");
            var errors = p.validate();
            expect(errors.getByField("color").length).toBe(0);
        });
        it('Choice Failed', function() {
            var p = Ext.create('Test.model.Person');
            p.set("color", "green");
            var errors = p.validate();
            expect(errors.getByField("color").length).toBe(1);
        });
    });
    describe('Model Associations', function() {
        it('books define in person', function() {
            var person = Ext.create('Test.model.Person');
            expect(person.books).toBeDefined();
        });
        it('person define in book', function() {
            var book = Ext.create('Test.model.Book');
            expect(book.getPerson).toBeDefined();
            expect(book.setPerson).toBeDefined();
        });
        it('associate books to person', function() {
            var book1 = Ext.create('Test.model.Book');
            book1.set('name', 'Book A');
            var book2 = Ext.create('Test.model.Book');
            book2.set('name', 'Book 2');
            var person = Ext.create('Test.model.Person', {id: 10});
            person.books().add(book1, book2);
            expect(person.books().count()).toEqual(2);
            person.books().remove(book2);
            expect(person.books().count()).toEqual(1);
            expect(book1.dirty).toBeTruthy();
        })
    });
});