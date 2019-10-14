import React from 'react';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {Easing} from 'react-native-reanimated';

const {
  add,
  and,
  call,
  cond,
  greaterThan,
  greaterOrEq,
  multiply,
  block,
  event,
  divide,
  or,
  eq,
  pow,
  atan,
  sqrt,
  sub,
  set,
  Value,
} = Animated;
const {ACTIVE, BEGAN, CANCELLED, END, FAILED, UNDETERMINED} = State;
const TRUE = 1;
const FALSE = 0;

class CircleNavigation extends React.Component {
  touchX = new Value(0);
  touchY = new Value(0);
  gestureState = new Value(UNDETERMINED);
  isOpen = new Value(FALSE);
  childrenScale = new Value(1);
  radius = new Value(this.props.diameter / 2);
  degrees = new Value(-1);

  onGestureEvent = event([
    {
      nativeEvent: {
        state: this.gestureState,
      },
    },
  ]);

  onPanGestureEvent = event([
    {
      nativeEvent: {
        x: x => set(this.touchX, sub(x, this.radius)),
        y: y => set(this.touchY, sub(y, this.radius)),
      },
    },
  ]);

  render() {
    const {children, initialComponentScaleTo, options} = this.props;

    return (
      <>
        <PanGestureHandler
          minDist={0}
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.onGestureEvent}>
          <Animated.View>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: this.childrenScale,
                  },
                ],
              }}>
              {children}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        <Animated.Code
          exec={block([
            cond(
              or(eq(this.gestureState, ACTIVE), eq(this.gestureState, BEGAN)),
              set(this.isOpen, TRUE),
            ),
            cond(eq(END, this.gestureState), set(this.isOpen, FALSE)),
            cond(
              eq(this.isOpen, FALSE),
              call([this.degrees], ([deg]) => {
                if (deg > 0) {
                  options[Math.floor(deg / (360 / options.length))].onSelect();
                }
              }),
            ),

            cond(
              eq(this.isOpen, TRUE),
              set(
                this.degrees,
                cond(
                  and(
                    eq(this.isOpen, TRUE),
                    greaterThan(
                      sqrt(add(pow(this.touchX, 2), pow(this.touchY, 2))),
                      multiply(this.radius, initialComponentScaleTo),
                    ),
                  ),
                  cond(
                    greaterOrEq(this.touchY, 0),
                    sub(
                      180,
                      divide(
                        multiply(atan(divide(this.touchX, this.touchY)), 180),
                        Math.PI,
                      ),
                    ),
                    cond(
                      greaterOrEq(this.touchX, 0),
                      divide(
                        multiply(atan(divide(this.touchX, this.touchY)), -180),
                        Math.PI,
                      ),
                      sub(
                        360,
                        divide(
                          multiply(atan(divide(this.touchX, this.touchY)), 180),
                          Math.PI,
                        ),
                      ),
                    ),
                  ),
                  -1,
                ),
              ),
            ),

            cond(
              eq(this.isOpen, TRUE),
              set(this.childrenScale, initialComponentScaleTo),
              set(this.childrenScale, 1),
            ),
          ])}
        />
      </>
    );
  }
}

export default CircleNavigation;
