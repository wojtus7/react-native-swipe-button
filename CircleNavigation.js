import React from 'react';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {Easing} from 'react-native-reanimated';

const {
  add,
  and,
  call,
  cond,
  greaterThan,
  multiply,
  block,
  cos,
  event,
  divide,
  eq,
  pow,
  atan,
  sqrt,
  sub,
  set,
  Value,
} = Animated;
const {ACTIVE, CANCELLED, END, FAILED, UNDETERMINED} = State;
const TRUE = 1;
const FALSE = 0;

class CircleNavigation extends React.Component {
  touchX = new Value(0);
  touchY = new Value(0);
  gestureState = new Value(UNDETERMINED);
  isOpen = new Value(FALSE);
  childrenScale = new Value(1);
  radius = new Value(this.props.diameter / 2);
  degrees = new Value(0);

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
    const {children, initialComponentScaleTo} = this.props;

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
            cond(eq(this.gestureState, ACTIVE), set(this.isOpen, TRUE)),
            cond(eq(END, this.gestureState), set(this.isOpen, FALSE)),
            cond(
              eq(this.isOpen, TRUE),
              set(this.childrenScale, initialComponentScaleTo),
              set(this.childrenScale, 1),
            ),
            cond(
              and(
                eq(this.isOpen, TRUE),
                greaterThan(
                  sqrt(add(pow(this.touchX, 2), pow(this.touchY, 2))),
                  multiply(this.radius, initialComponentScaleTo),
                ),
              ),
              cond(
                greaterThan(this.touchY, 0),
                set(
                  this.degrees,
                  sub(
                    180,
                    divide(
                      multiply(atan(divide(this.touchX, this.touchY)), 180),
                      Math.PI,
                    ),
                  ),
                ),
                cond(
                  greaterThan(this.touchX, 0),
                  set(
                    this.degrees,
                    divide(
                      multiply(atan(divide(this.touchX, this.touchY)), -180),
                      Math.PI,
                    ),
                  ),
                  set(
                    this.degrees,
                    sub(
                      360,
                      divide(
                        multiply(atan(divide(this.touchX, this.touchY)), 180),
                        Math.PI,
                      ),
                    ),
                  ),
                ),
              ),
              set(this.degrees, 0),
            ),

            call([this.degrees], ([deg]) => {
              console.log(deg);
            }),
          ])}
        />
      </>
    );
  }
}

export default CircleNavigation;
