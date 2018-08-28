Система за мениджмънт на клетки (футболни)

1. Логин
2. Начална страница
3. Страница на клетка
4. Календар с всички клетки
5. Организиране на клетка
6. Настройки (на авторските клетки)
7. Администраторски панел
8. Личен профил
9. Изход

1
Логина работи през Firebase само с Facebook акаунти.
Вързано е към fb apps. Взема токена, снимката и мейл адреса.
При успешен логин - връща към индекса, при неуспешен - според firebase документацията.

2
Началната страница е като каталог за дневните клетки.
Ако гост я преглежда - само гледа клетките и участниците в тях, а ако е логнат юзър - може да се присъедини ако има свободно място.
Филтри според часа и името на града.

3
Страницата на клетката съдържа само информативна информация - къде се провежда, кога и при какви евентуално метеорологични условия (Accuweather api).
Разделя участниците на 2 отбора, извежда полевите играчи и вратарите.
Възможност за допълнително разбиране помежду участниците с Disquis api-то.

4
Календара представлява графично изображение на месец период от датата с всички клетки.
Предвиден е за по-дълго планиране на клетки.
При клик - отвежда към страницата с инфо към дадената клетка.
Не е добавена възможност за присъединяване, защото обикновено това се случва най-коректно в деня на клетката, а през другото време може да добавя само автора. Това е да не се прецака клетката (някой да забрави, че се е писал).

5
Организиране на клетка - представлява създаване на клетката като евент в системата.
Няколко полета, ако не са попълнени задължителните - не може да с е събмитва.
Ако се посочи друг/град (Accuweather), излиза динамично поле, в което да се добави инфото.

6
Мениджмънт на всички авторски клетки.
Ако евента е минал - не може да се редактирва и трие - може да се гледа само.
Дава кратка напътстваща информация за евентите.

7
Панела за администратори (хардкоднати) дава възможност за преглед на всички клетки в системата, сортирани по време и възможност за изтриването им.

8
Личния профил дисплейва името, мейла и снимката от фейсбук профила на юзъра.
Вади инфо - колко клетки е създал юзъра и с кого обича най-много да играе.

9
Изход от firebase -> redirect като гост.