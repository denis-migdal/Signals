-> Pool After...

Note :
- add in trigger : initial trigger + delay add after end of current trigger.
- remove in trigger (source changed) - check if ancestor of cur is self.
    - tag + delay remove.

Fast :
- Use Callback linkedList : better add/remove during trigger.
    -> object pool.
- Sources are LinkedList elements.